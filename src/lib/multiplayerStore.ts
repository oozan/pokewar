import { createId, readStorage, writeStorage } from "./storage";
import { getAllUsers, getUserById } from "./authStore";

export interface FriendRequest {
  id: string;
  fromId: string;
  toId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

export interface ServerInvite {
  id: string;
  serverId: string;
  fromId: string;
  toId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

export interface Server {
  id: string;
  name: string;
  ownerId: string;
  memberIds: string[];
  createdAt: string;
}

export interface ServerSelection {
  id: string;
  serverId: string;
  userId: string;
  pokemonId: string;
  pokemonName: string;
  createdAt: string;
}

export interface MatchRecord {
  id: string;
  serverId: string;
  player1Id: string;
  player2Id: string;
  player1PokemonId: string;
  player1PokemonName: string;
  player2PokemonId: string;
  player2PokemonName: string;
  winnerId: string;
  createdAt: string;
}

const FRIEND_REQUESTS_KEY = "pokewar_friend_requests_v1";
const SERVER_INVITES_KEY = "pokewar_server_invites_v1";
const SERVERS_KEY = "pokewar_servers_v1";
const SELECTIONS_KEY = "pokewar_selections_v1";
const MATCHES_KEY = "pokewar_matches_v1";

const getFriendRequests = (): FriendRequest[] =>
  readStorage<FriendRequest[]>(FRIEND_REQUESTS_KEY, []);

const setFriendRequests = (requests: FriendRequest[]) => {
  writeStorage(FRIEND_REQUESTS_KEY, requests);
};

const getServerInvites = (): ServerInvite[] =>
  readStorage<ServerInvite[]>(SERVER_INVITES_KEY, []);

const setServerInvites = (invites: ServerInvite[]) => {
  writeStorage(SERVER_INVITES_KEY, invites);
};

const getServers = (): Server[] => readStorage<Server[]>(SERVERS_KEY, []);

const setServers = (servers: Server[]) => {
  writeStorage(SERVERS_KEY, servers);
};

const getSelections = (): ServerSelection[] =>
  readStorage<ServerSelection[]>(SELECTIONS_KEY, []);

const setSelections = (selections: ServerSelection[]) => {
  writeStorage(SELECTIONS_KEY, selections);
};

const getMatches = (): MatchRecord[] =>
  readStorage<MatchRecord[]>(MATCHES_KEY, []);

const setMatches = (matches: MatchRecord[]) => {
  writeStorage(MATCHES_KEY, matches);
};

export const sendFriendRequest = ({
  fromId,
  toEmail,
}: {
  fromId: string;
  toEmail: string;
}): FriendRequest => {
  const users = getAllUsers();
  const recipient = users.find(
    (user) => user.email.toLowerCase() === toEmail.trim().toLowerCase()
  );
  if (!recipient) {
    throw new Error("No trainer was found with that email.");
  }
  if (recipient.id === fromId) {
    throw new Error("You cannot send a request to yourself.");
  }

  const requests = getFriendRequests();
  const existing = requests.find(
    (request) =>
      (request.fromId === fromId && request.toId === recipient.id) ||
      (request.fromId === recipient.id && request.toId === fromId)
  );
  if (existing) {
    if (existing.status === "pending") {
      throw new Error("A request is already pending for this trainer.");
    }
    if (existing.status === "accepted") {
      throw new Error("You are already friends.");
    }
  }

  const request: FriendRequest = {
    id: createId(),
    fromId,
    toId: recipient.id,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  setFriendRequests([...requests, request]);
  return request;
};

export const respondToFriendRequest = ({
  requestId,
  status,
}: {
  requestId: string;
  status: "accepted" | "declined";
}): FriendRequest => {
  const requests = getFriendRequests();
  const updated = requests.map((request) =>
    request.id === requestId ? { ...request, status } : request
  );
  setFriendRequests(updated);
  const request = updated.find((item) => item.id === requestId);
  if (!request) {
    throw new Error("Friend request not found.");
  }
  return request;
};

export const getFriendRequestsForUser = (userId: string) => {
  const requests = getFriendRequests();
  return requests.filter(
    (request) => request.fromId === userId || request.toId === userId
  );
};

export const getFriendsForUser = (userId: string) => {
  const requests = getFriendRequests();
  const accepted = requests.filter(
    (request) =>
      request.status === "accepted" &&
      (request.fromId === userId || request.toId === userId)
  );
  const ids = new Set<string>();
  accepted.forEach((request) => {
    ids.add(request.fromId === userId ? request.toId : request.fromId);
  });
  return Array.from(ids)
    .map((id) => getUserById(id))
    .filter((user): user is NonNullable<typeof user> => Boolean(user));
};

export const createServer = ({
  name,
  ownerId,
}: {
  name: string;
  ownerId: string;
}): Server => {
  const servers = getServers();
  const server: Server = {
    id: createId(),
    name: name.trim() || "Private Arena",
    ownerId,
    memberIds: [ownerId],
    createdAt: new Date().toISOString(),
  };
  setServers([...servers, server]);
  return server;
};

export const getServerById = (serverId: string): Server | null => {
  const servers = getServers();
  return servers.find((server) => server.id === serverId) ?? null;
};

export const getServersForUser = (userId: string) => {
  const servers = getServers();
  return servers.filter((server) => server.memberIds.includes(userId));
};

export const inviteToServer = ({
  serverId,
  fromId,
  toId,
}: {
  serverId: string;
  fromId: string;
  toId: string;
}): ServerInvite => {
  const server = getServerById(serverId);
  if (!server) {
    throw new Error("Server not found.");
  }
  if (server.ownerId !== fromId) {
    throw new Error("Only the server owner can send invites.");
  }
  if (server.memberIds.includes(toId)) {
    throw new Error("That trainer is already in this server.");
  }
  if (server.memberIds.length >= 2) {
    throw new Error("This server already has two members.");
  }

  const invites = getServerInvites();
  const existing = invites.find(
    (invite) =>
      invite.serverId === serverId &&
      invite.toId === toId &&
      invite.status === "pending"
  );
  if (existing) {
    throw new Error("An invite is already pending for this trainer.");
  }

  const invite: ServerInvite = {
    id: createId(),
    serverId,
    fromId,
    toId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  setServerInvites([...invites, invite]);
  return invite;
};

export const respondToServerInvite = ({
  inviteId,
  status,
}: {
  inviteId: string;
  status: "accepted" | "declined";
}): ServerInvite => {
  const invites = getServerInvites();
  const invite = invites.find((item) => item.id === inviteId);
  if (!invite) {
    throw new Error("Invite not found.");
  }
  const updatedInvites = invites.map((item) =>
    item.id === inviteId ? { ...item, status } : item
  );
  setServerInvites(updatedInvites);

  if (status === "accepted") {
    const servers = getServers();
    const updatedServers = servers.map((server) =>
      server.id === invite.serverId
        ? {
            ...server,
            memberIds: Array.from(
              new Set([...server.memberIds, invite.toId])
            ),
          }
        : server
    );
    setServers(updatedServers);
  }

  return { ...invite, status };
};

export const getServerInvitesForUser = (userId: string) => {
  const invites = getServerInvites();
  return invites.filter((invite) => invite.toId === userId);
};

export const setServerSelection = ({
  serverId,
  userId,
  pokemonId,
  pokemonName,
}: {
  serverId: string;
  userId: string;
  pokemonId: string;
  pokemonName: string;
}): ServerSelection => {
  const selections = getSelections();
  const existing = selections.find(
    (selection) =>
      selection.serverId === serverId && selection.userId === userId
  );
  const updatedSelection: ServerSelection = {
    id: existing?.id ?? createId(),
    serverId,
    userId,
    pokemonId,
    pokemonName,
    createdAt: new Date().toISOString(),
  };
  const updatedSelections = existing
    ? selections.map((selection) =>
        selection.id === existing.id ? updatedSelection : selection
      )
    : [...selections, updatedSelection];
  setSelections(updatedSelections);
  return updatedSelection;
};

export const getSelectionsForServer = (serverId: string) => {
  const selections = getSelections();
  return selections.filter((selection) => selection.serverId === serverId);
};

export const clearSelectionsForServer = (serverId: string) => {
  const selections = getSelections();
  const updated = selections.filter(
    (selection) => selection.serverId !== serverId
  );
  setSelections(updated);
};

export const createMatchFromSelections = (
  serverId: string
): MatchRecord => {
  const server = getServerById(serverId);
  if (!server) {
    throw new Error("Server not found.");
  }
  const selections = getSelectionsForServer(serverId);
  if (selections.length < 2) {
    throw new Error("Two trainers must select a Pokemon first.");
  }
  const [first, second] = selections.slice(0, 2);
  if (first.userId === second.userId) {
    throw new Error("Both selections must be from different trainers.");
  }
  const winner = Math.random() > 0.5 ? first : second;
  const match: MatchRecord = {
    id: createId(),
    serverId,
    player1Id: first.userId,
    player2Id: second.userId,
    player1PokemonId: first.pokemonId,
    player1PokemonName: first.pokemonName,
    player2PokemonId: second.pokemonId,
    player2PokemonName: second.pokemonName,
    winnerId: winner.userId,
    createdAt: new Date().toISOString(),
  };
  const matches = getMatches();
  setMatches([...matches, match]);
  clearSelectionsForServer(serverId);
  return match;
};

export const getMatchesForUser = (userId: string) => {
  const matches = getMatches();
  return matches.filter(
    (match) => match.player1Id === userId || match.player2Id === userId
  );
};

export const getMatchHistoryForServer = (serverId: string) => {
  const matches = getMatches();
  return matches.filter((match) => match.serverId === serverId);
};
