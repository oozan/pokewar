import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useAuth } from "@/lib/auth-context";
import { validateEmail } from "@/lib/validation";
import {
  createServer,
  getFriendRequestsForUser,
  getFriendsForUser,
  getServerById,
  getServerInvitesForUser,
  getServersForUser,
  inviteToServer,
  respondToFriendRequest,
  respondToServerInvite,
  sendFriendRequest,
} from "@/lib/multiplayerStore";
import { getUserById } from "@/lib/authStore";

export default function MultiplayerLobby() {
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  const [serverName, setServerName] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [actionError, setActionError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    if (!user) {
      router.replace("/auth/login");
      return;
    }
  }, [ready, user, router]);

  const [friendRequests, setFriendRequests] = useState(
    [] as ReturnType<typeof getFriendRequestsForUser>
  );

  const incomingRequests = friendRequests.filter(
    (request) => request.toId === user?.id && request.status === "pending"
  );
  const outgoingRequests = friendRequests.filter(
    (request) => request.fromId === user?.id && request.status === "pending"
  );

  const [friends, setFriends] = useState(
    [] as ReturnType<typeof getFriendsForUser>
  );

  const [serverInvites, setServerInvites] = useState(
    [] as ReturnType<typeof getServerInvitesForUser>
  );

  const [servers, setServers] = useState(
    [] as ReturnType<typeof getServersForUser>
  );

  useEffect(() => {
    if (!user) return;
    setFriendRequests(getFriendRequestsForUser(user.id));
    setFriends(getFriendsForUser(user.id));
    setServerInvites(
      getServerInvitesForUser(user.id).filter(
        (invite) => invite.status === "pending"
      )
    );
    setServers(getServersForUser(user.id));
  }, [user, refreshKey]);

  const handleCreateServer = () => {
    if (!user) return;
    if (!serverName.trim()) {
      setActionError("Please name your server.");
      return;
    }
    try {
      createServer({ name: serverName, ownerId: user.id });
      setServerName("");
      setActionError("");
      refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not create your server.";
      setActionError(message);
    }
  };

  const handleFriendRequest = () => {
    if (!user) return;
    const emailMessage = validateEmail(friendEmail);
    if (emailMessage) {
      setActionError(emailMessage);
      return;
    }
    try {
      sendFriendRequest({ fromId: user.id, toEmail: friendEmail });
      setFriendEmail("");
      setActionError("");
      refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not send that request.";
      setActionError(message);
    }
  };

  const handleRespondFriendRequest = (
    requestId: string,
    status: "accepted" | "declined"
  ) => {
    try {
      respondToFriendRequest({ requestId, status });
      refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not update that request.";
      setActionError(message);
    }
  };

  const handleRespondServerInvite = (
    inviteId: string,
    status: "accepted" | "declined"
  ) => {
    try {
      respondToServerInvite({ inviteId, status });
      refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not update that invite.";
      setActionError(message);
    }
  };

  const handleInviteToServer = (serverId: string, friendId: string) => {
    if (!user) return;
    try {
      inviteToServer({ serverId, fromId: user.id, toId: friendId });
      refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not send the invite.";
      setActionError(message);
    }
  };

  if (!ready || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f6f1e7] px-6 py-12 text-[#1f2a24]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#8a6f45]">
              Multiplayer Lobby
            </p>
            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
              Welcome back, {user.name}
            </h1>
            <p className="mt-2 text-sm text-[#4a3f31]">
              Manage servers, accept invites, and host your next duel.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em]">
            <Link
              href="/profile"
              className="rounded-full border border-[#1f2a24]/30 px-4 py-2 text-[#1f2a24] transition hover:bg-[#1f2a24]/10"
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="rounded-full bg-[#1f2a24] px-4 py-2 text-[#f6f1e7] shadow-[0_12px_25px_rgba(31,42,36,0.25)] transition hover:-translate-y-0.5"
            >
              Sign Out
            </button>
          </div>
        </header>

        {actionError && (
          <div className="rounded-2xl border border-[#b3502c]/30 bg-[#fbe8df] px-5 py-3 text-sm font-semibold text-[#b3502c]">
            {actionError}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-[#1f2a24]/10 bg-white/80 p-6 shadow-[0_20px_50px_rgba(31,42,36,0.12)]">
            <h2 className="text-lg font-semibold">Create a Server</h2>
            <p className="mt-2 text-sm text-[#4a3f31]">
              Servers are private rooms for two trainers. Name yours and invite
              a friend.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={serverName}
                onChange={(event) => setServerName(event.target.value)}
                className="flex-1 rounded-2xl border border-[#1f2a24]/20 bg-white px-4 py-3 text-sm focus:border-[#8a6f45] focus:outline-none focus:ring-2 focus:ring-[#8a6f45]/40"
                placeholder="Velvet Vault"
              />
              <button
                onClick={handleCreateServer}
                className="rounded-2xl bg-[#1f2a24] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#f6f1e7] shadow-[0_12px_25px_rgba(31,42,36,0.25)] transition hover:-translate-y-0.5"
              >
                Create
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#1f2a24]/10 bg-white/80 p-6 shadow-[0_20px_50px_rgba(31,42,36,0.12)]">
            <h2 className="text-lg font-semibold">Invite a Friend</h2>
            <p className="mt-2 text-sm text-[#4a3f31]">
              Send a friend request to someone already signed in.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={friendEmail}
                onChange={(event) => setFriendEmail(event.target.value)}
                className="flex-1 rounded-2xl border border-[#1f2a24]/20 bg-white px-4 py-3 text-sm focus:border-[#8a6f45] focus:outline-none focus:ring-2 focus:ring-[#8a6f45]/40"
                placeholder="friend@pokewar.com"
              />
              <button
                onClick={handleFriendRequest}
                className="rounded-2xl border border-[#1f2a24]/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f2a24] transition hover:bg-[#1f2a24]/10"
              >
                Send Request
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-[#1f2a24]/10 bg-white/80 p-6 shadow-[0_20px_50px_rgba(31,42,36,0.12)]">
            <h3 className="text-lg font-semibold">Friend Requests</h3>
            {incomingRequests.length === 0 && (
              <p className="mt-3 text-sm text-[#4a3f31]">
                No incoming requests right now.
              </p>
            )}
            <div className="mt-4 flex flex-col gap-3">
              {incomingRequests.map((request) => {
                const sender = getUserById(request.fromId);
                return (
                  <div
                    key={request.id}
                    className="rounded-2xl border border-[#1f2a24]/10 bg-[#f8f3ea] p-4 text-sm"
                  >
                    <p className="font-semibold text-[#1f2a24]">
                      {sender?.name ?? "Unknown Trainer"}
                    </p>
                    <p className="text-xs text-[#4a3f31]">{sender?.email}</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() =>
                          handleRespondFriendRequest(request.id, "accepted")
                        }
                        className="rounded-full bg-[#1f2a24] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#f6f1e7]"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleRespondFriendRequest(request.id, "declined")
                        }
                        className="rounded-full border border-[#1f2a24]/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f2a24]"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {outgoingRequests.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a6f45]">
                  Pending
                </p>
                <div className="mt-3 flex flex-col gap-3">
                  {outgoingRequests.map((request) => {
                    const recipient = getUserById(request.toId);
                    return (
                      <div
                        key={request.id}
                        className="rounded-2xl border border-[#1f2a24]/10 bg-white/80 p-3 text-xs text-[#4a3f31]"
                      >
                        {recipient?.name ?? "Unknown Trainer"} •{" "}
                        {recipient?.email}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-[#1f2a24]/10 bg-white/80 p-6 shadow-[0_20px_50px_rgba(31,42,36,0.12)]">
            <h3 className="text-lg font-semibold">Server Invites</h3>
            {serverInvites.length === 0 && (
              <p className="mt-3 text-sm text-[#4a3f31]">
                No server invites yet.
              </p>
            )}
            <div className="mt-4 flex flex-col gap-3">
              {serverInvites.map((invite) => {
                const server = getServerById(invite.serverId);
                const sender = getUserById(invite.fromId);
                return (
                  <div
                    key={invite.id}
                    className="rounded-2xl border border-[#1f2a24]/10 bg-[#f8f3ea] p-4 text-sm"
                  >
                    <p className="font-semibold text-[#1f2a24]">
                      {server?.name ?? "Private Server"}
                    </p>
                    <p className="text-xs text-[#4a3f31]">
                      Invite from {sender?.name ?? "Unknown Trainer"}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() =>
                          handleRespondServerInvite(invite.id, "accepted")
                        }
                        className="rounded-full bg-[#1f2a24] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#f6f1e7]"
                      >
                        Join
                      </button>
                      <button
                        onClick={() =>
                          handleRespondServerInvite(invite.id, "declined")
                        }
                        className="rounded-full border border-[#1f2a24]/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f2a24]"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#1f2a24]/10 bg-white/80 p-6 shadow-[0_20px_50px_rgba(31,42,36,0.12)]">
            <h3 className="text-lg font-semibold">Friends</h3>
            {friends.length === 0 && (
              <p className="mt-3 text-sm text-[#4a3f31]">
                Add a friend to start a server.
              </p>
            )}
            <div className="mt-4 flex flex-col gap-3">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="rounded-2xl border border-[#1f2a24]/10 bg-[#f8f3ea] p-4 text-sm"
                >
                  <p className="font-semibold text-[#1f2a24]">{friend.name}</p>
                  <p className="text-xs text-[#4a3f31]">{friend.email}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-[#1f2a24]/10 bg-white/80 p-8 shadow-[0_20px_50px_rgba(31,42,36,0.12)]">
          <h2 className="text-xl font-semibold">Your Servers</h2>
          {servers.length === 0 && (
            <p className="mt-3 text-sm text-[#4a3f31]">
              You have no servers yet. Create one above to begin.
            </p>
          )}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {servers.map((server) => {
              const members = server.memberIds
                .map((id) => getUserById(id))
                .filter((member): member is NonNullable<typeof member> =>
                  Boolean(member)
                );
              const availableFriends = friends.filter(
                (friend) => !server.memberIds.includes(friend.id)
              );
              const canInvite = server.ownerId === user.id;
              return (
                <div
                  key={server.id}
                  className="flex flex-col gap-4 rounded-2xl border border-[#1f2a24]/10 bg-[#f8f3ea] p-5"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a6f45]">
                      Server
                    </p>
                    <h3 className="text-lg font-semibold">{server.name}</h3>
                    <p className="mt-2 text-sm text-[#4a3f31]">
                      Members: {members.map((member) => member.name).join(", ")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/multiplayer/server/${server.id}`}
                      className="rounded-full bg-[#1f2a24] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#f6f1e7]"
                    >
                      Enter Server
                    </Link>
                    {canInvite && (
                      <div className="flex flex-1 flex-wrap gap-2">
                        {availableFriends.length === 0 && (
                          <span className="text-xs text-[#4a3f31]">
                            {server.memberIds.length >= 2
                              ? "Server is full."
                              : "No available friends."}
                          </span>
                        )}
                        {availableFriends.map((friend) => (
                          <button
                            key={friend.id}
                            onClick={() =>
                              handleInviteToServer(server.id, friend.id)
                            }
                            className="rounded-full border border-[#1f2a24]/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f2a24]"
                          >
                            Invite {friend.name.split(" ")[0]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
