import { createId, readStorage, removeStorage, writeStorage } from "./storage";

export type AuthProvider = "email" | "google";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: AuthProvider;
  createdAt: string;
}

interface StoredUser extends AuthUser {
  passwordHash?: string;
}

const USERS_KEY = "pokewar_users_v1";
const SESSION_KEY = "pokewar_auth_session_v1";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const toBase64 = (value: string): string => {
  if (typeof window === "undefined") {
    return value;
  }
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const hashPassword = (password: string): string =>
  `${toBase64(password).split("").reverse().join("")}`;

const stripPassword = (user: StoredUser): AuthUser => {
  const { passwordHash, ...rest } = user;
  void passwordHash;
  return rest;
};

const getStoredUsers = (): StoredUser[] => readStorage<StoredUser[]>(USERS_KEY, []);

const setStoredUsers = (users: StoredUser[]): void => {
  writeStorage(USERS_KEY, users);
};

const setSession = (userId: string): void => {
  writeStorage(SESSION_KEY, { userId });
};

const clearSession = (): void => {
  removeStorage(SESSION_KEY);
};

export const getAllUsers = (): AuthUser[] =>
  getStoredUsers().map((user) => stripPassword(user));

export const getUserById = (userId: string): AuthUser | null => {
  const user = getStoredUsers().find((item) => item.id === userId);
  return user ? stripPassword(user) : null;
};

export const findUserByEmail = (email: string): AuthUser | null => {
  const normalized = normalizeEmail(email);
  const user = getStoredUsers().find(
    (item) => normalizeEmail(item.email) === normalized
  );
  return user ? stripPassword(user) : null;
};

const getStoredUserByEmail = (email: string): StoredUser | null => {
  const normalized = normalizeEmail(email);
  const user = getStoredUsers().find(
    (item) => normalizeEmail(item.email) === normalized
  );
  return user ?? null;
};

export const getCurrentUser = (): AuthUser | null => {
  const session = readStorage<{ userId: string } | null>(SESSION_KEY, null);
  if (!session) {
    return null;
  }
  const user = getStoredUsers().find((item) => item.id === session.userId);
  return user ? stripPassword(user) : null;
};

export const signOut = (): void => {
  clearSession();
};

export const createUserWithEmail = ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): AuthUser => {
  const users = getStoredUsers();
  const normalized = normalizeEmail(email);
  if (users.some((user) => normalizeEmail(user.email) === normalized)) {
    throw new Error("That email already has an account.");
  }
  const newUser: StoredUser = {
    id: createId(),
    name: name.trim(),
    email: normalized,
    provider: "email",
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  const updated = [...users, newUser];
  setStoredUsers(updated);
  setSession(newUser.id);
  return stripPassword(newUser);
};

export const authenticateWithEmail = ({
  email,
  password,
}: {
  email: string;
  password: string;
}): AuthUser => {
  const normalized = normalizeEmail(email);
  const user = getStoredUserByEmail(normalized);
  if (!user || user.provider !== "email") {
    throw new Error("No email account was found for that address.");
  }
  if (user.passwordHash !== hashPassword(password)) {
    throw new Error("The password you entered is incorrect.");
  }
  setSession(user.id);
  return stripPassword(user);
};

const deriveNameFromEmail = (email: string): string => {
  const handle = email.split("@")[0];
  if (!handle) {
    return "Trainer";
  }
  const safe = handle.replace(/[._-]+/g, " ").trim();
  return safe
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const loginWithGoogle = ({
  email,
  name,
}: {
  email: string;
  name?: string;
}): AuthUser => {
  const normalized = normalizeEmail(email);
  const existing = getStoredUserByEmail(normalized);
  if (existing) {
    setSession(existing.id);
    return stripPassword(existing);
  }

  const newUser: StoredUser = {
    id: createId(),
    name: name?.trim() || deriveNameFromEmail(normalized),
    email: normalized,
    provider: "google",
    createdAt: new Date().toISOString(),
  };
  const users = getStoredUsers();
  setStoredUsers([...users, newUser]);
  setSession(newUser.id);
  return stripPassword(newUser);
};
