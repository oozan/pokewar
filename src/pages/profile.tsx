import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useAuth } from "@/lib/auth-context";
import { getUserById } from "@/lib/authStore";
import { getMatchesForUser } from "@/lib/multiplayerStore";

export default function ProfilePage() {
  const router = useRouter();
  const { user, ready, logout } = useAuth();

  useEffect(() => {
    if (!ready) {
      return;
    }
    if (!user) {
      router.replace("/auth/login");
    }
  }, [ready, user, router]);

  const matches = useMemo(() => {
    if (!user) return [];
    return getMatchesForUser(user.id);
  }, [user]);

  const sortedMatches = useMemo(
    () =>
      [...matches].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [matches]
  );

  const wins = matches.filter((match) => match.winnerId === user?.id).length;
  const losses = matches.length - wins;

  if (!ready || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f6f1e7] px-6 py-12 text-[#1f2a24]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#8a6f45]">
              Profile
            </p>
            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
              {user.name}
            </h1>
            <p className="mt-1 text-sm text-[#4a3f31]">{user.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em]">
            <Link
              href="/multiplayer"
              className="rounded-full border border-[#1f2a24]/30 px-4 py-2 text-[#1f2a24] transition hover:bg-[#1f2a24]/10"
            >
              Back to Lobby
            </Link>
            <button
              onClick={logout}
              className="rounded-full bg-[#1f2a24] px-4 py-2 text-[#f6f1e7] shadow-[0_12px_25px_rgba(31,42,36,0.25)] transition hover:-translate-y-0.5"
            >
              Sign Out
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-[#1f2a24]/10 bg-white/80 p-6 shadow-[0_20px_50px_rgba(31,42,36,0.12)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a6f45]">
              Wins
            </p>
            <p className="mt-3 text-4xl font-semibold">{wins}</p>
          </div>
          <div className="rounded-[28px] border border-[#1f2a24]/10 bg-white/80 p-6 shadow-[0_20px_50px_rgba(31,42,36,0.12)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a6f45]">
              Losses
            </p>
            <p className="mt-3 text-4xl font-semibold">{losses}</p>
          </div>
          <div className="rounded-[28px] border border-[#1f2a24]/10 bg-white/80 p-6 shadow-[0_20px_50px_rgba(31,42,36,0.12)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a6f45]">
              Total Matches
            </p>
            <p className="mt-3 text-4xl font-semibold">{matches.length}</p>
          </div>
        </section>

        <section className="rounded-[32px] border border-[#1f2a24]/10 bg-white/80 p-6 shadow-[0_20px_50px_rgba(31,42,36,0.12)]">
          <h2 className="text-lg font-semibold">Match History</h2>
          {matches.length === 0 && (
            <p className="mt-3 text-sm text-[#4a3f31]">
              You have no recorded matches yet.
            </p>
          )}
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {sortedMatches.map((match) => {
              const opponentId =
                match.player1Id === user.id
                  ? match.player2Id
                  : match.player1Id;
              const opponent = getUserById(opponentId);
              const didWin = match.winnerId === user.id;
              return (
                <div
                  key={match.id}
                  className="rounded-2xl border border-[#1f2a24]/10 bg-[#f8f3ea] p-4 text-sm"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-[#8a6f45]">
                    {new Date(match.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-2 font-semibold text-[#1f2a24]">
                    {didWin ? "Victory" : "Defeat"} vs{" "}
                    {opponent?.name ?? "Trainer"}
                  </p>
                  <p className="mt-1 text-[#4a3f31]">
                    {match.player1PokemonName} vs{" "}
                    {match.player2PokemonName}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
