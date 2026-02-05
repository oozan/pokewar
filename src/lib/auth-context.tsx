import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { signOut as signOutNextAuth, useSession } from "next-auth/react";
import type { AuthUser } from "./authStore";
import {
  authenticateWithEmail,
  createUserWithEmail,
  getCurrentUser,
  loginWithGoogle,
  signOut as signOutLocal,
} from "./authStore";

interface AuthContextValue {
  user: AuthUser | null;
  ready: boolean;
  signupWithEmail: (payload: {
    name: string;
    email: string;
    password: string;
  }) => Promise<AuthUser>;
  loginWithEmail: (payload: {
    email: string;
    password: string;
  }) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }
    const email = session?.user?.email;
    if (!email) {
      return;
    }
    const name = session.user?.name ?? undefined;
    const authenticated = loginWithGoogle({ email, name });
    setUser(authenticated);
  }, [status, session?.user?.email, session?.user?.name]);

  const ready = initialized && status !== "loading";

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      signupWithEmail: async (payload) => {
        const created = createUserWithEmail(payload);
        setUser(created);
        return created;
      },
      loginWithEmail: async (payload) => {
        const authenticated = authenticateWithEmail(payload);
        setUser(authenticated);
        return authenticated;
      },
      logout: () => {
        signOutLocal();
        setUser(null);
        if (status === "authenticated") {
          void signOutNextAuth({ redirect: false });
        }
      },
    }),
    [user, ready, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
};
