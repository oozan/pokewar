import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

import { useAuth } from "@/lib/auth-context";
import {
  createMatchFromSelections,
  getMatchHistoryForServer,
  getSelectionsForServer,
  getServerById,
  setServerSelection,
} from "@/lib/multiplayerStore";
import { getUserById } from "@/lib/authStore";
import { fetchPokemons, getPokemonImageUrl } from "@/lib/pokemonService";
import SearchBar from "@/components/search-bar/search-bar";

interface Pokemon {
  name: string;
  url: string;
}

export default function ServerRoomPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, ready } = useAuth();
  const [serverError, setServerError] = useState("");
  const [actionError, setActionError] = useState("");
  const [serverName, setServerName] = useState("");
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [selections, setSelections] = useState(
    [] as ReturnType<typeof getSelectionsForServer>
  );
  const [matches, setMatches] = useState(
    [] as ReturnType<typeof getMatchHistoryForServer>
  );
  const [latestMatchId, setLatestMatchId] = useState<string | null>(null);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const serverId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    if (!ready) {
      return;
    }
    if (!user) {
      router.replace("/auth/login");
      return;
    }
  }, [ready, user, router]);

  useEffect(() => {
    if (!serverId || !user) {
      return;
    }
    const server = getServerById(serverId);
    if (!server) {
      setServerError("Server not found.");
      return;
    }
    if (!server.memberIds.includes(user.id)) {
      setServerError("You are not a member of this server.");
      return;
    }
    setServerError("");
    setServerName(server.name);
    setMemberIds(server.memberIds);
    setSelections(getSelectionsForServer(serverId));
    setMatches(getMatchHistoryForServer(serverId));
  }, [serverId, user, refreshKey]);

  useEffect(() => {
    const loadPokemons = async () => {
      const data = await fetchPokemons(1000);
      setPokemons(data);
      setFilteredPokemons(data);
    };
    loadPokemons();
  }, []);

  const currentSelection = useMemo(() => {
    if (!user) return null;
    return selections.find((selection) => selection.userId === user.id) ?? null;
  }, [selections, user]);

  const opponentSelection = useMemo(() => {
    if (!user) return null;
    return selections.find((selection) => selection.userId !== user.id) ?? null;
  }, [selections, user]);

  const sortedMatches = useMemo(
    () =>
      [...matches].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [matches]
  );

  const latestMatch = useMemo(() => {
    if (latestMatchId) {
      return matches.find((match) => match.id === latestMatchId) ?? null;
    }
    return sortedMatches[0] ?? null;
  }, [matches, latestMatchId, sortedMatches]);

  const handleSelectPokemon = (pokemon: Pokemon) => {
    if (!user || !serverId) return;
    const pokemonId = pokemon.url.split("/")[6];
    setServerSelection({
      serverId,
      userId: user.id,
      pokemonId,
      pokemonName: pokemon.name,
    });
    setActionError("");
    setRefreshKey((prev) => prev + 1);
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredPokemons(pokemons);
      return;
    }
    const filtered = pokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPokemons(filtered);
  };

  const handleStartFight = () => {
    if (!serverId) return;
    try {
      const match = createMatchFromSelections(serverId);
      setLatestMatchId(match.id);
      setActionError("");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not start the fight.";
      setActionError(message);
    }
  };

  if (!ready || !user) {
    return null;
  }

  if (serverError) {
    return (
      <div className="min-h-screen bg-[#f6f1e7] px-6 py-20 text-center text-[#1f2a24]">
        <p className="text-lg font-semibold">{serverError}</p>
        <Link
          href="/multiplayer"
          className="mt-6 inline-flex rounded-full border border-[#1f2a24]/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f2a24]"
        >
          Return to Lobby
        </Link>
      </div>
    );
  }

  const opponent = memberIds.find((memberId) => memberId !== user.id);
  const opponentUser = opponent ? getUserById(opponent) : null;
  const canStartFight =
    selections.length >= 2 &&
    selections.some((selection) => selection.userId === user.id);

  return (
    <div className="min-h-screen bg-[#f6f1e7] px-6 py-12 text-[#1f2a24]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#8a6f45]">
              Private Server
            </p>
            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
              {serverName}
            </h1>
            <p className="mt-2 text-sm text-[#4a3f31]">
              Members:{" "}
              {memberIds
                .map((memberId) => getUserById(memberId)?.name ?? "Trainer")
                .join(" & ")}
            </p>
          </div>
          <Link
            href="/multiplayer"
            className="rounded-full border border-[#1f2a24]/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f2a24] transition hover:bg-[#1f2a24]/10"
          >
            Back to Lobby
          </Link>
        </header>

        {actionError && (
          <div className="rounded-2xl border border-[#b3502c]/30 bg-[#fbe8df] px-5 py-3 text-sm font-semibold text-[#b3502c]">
            {actionError}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-[#1f2a24]/10 bg-white/80 p-6 shadow-[0_20px_50px_rgba(31,42,36,0.12)]">
            <h2 className="text-lg font-semibold">Selection Status</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#1f2a24]/10 bg-[#f8f3ea] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a6f45]">
                  You
                </p>
                <p className="mt-2 text-sm font-semibold">
                  {currentSelection
                    ? currentSelection.pokemonName
                    : "No selection yet"}
                </p>
              </div>
              <div className="rounded-2xl border border-[#1f2a24]/10 bg-[#f8f3ea] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a6f45]">
                  {opponentUser?.name ?? "Opponent"}
                </p>
                <p className="mt-2 text-sm font-semibold">
                  {opponentSelection
                    ? opponentSelection.pokemonName
                    : "Awaiting selection"}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={handleStartFight}
                disabled={!canStartFight}
                className="rounded-full bg-[#1f2a24] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#f6f1e7] shadow-[0_12px_25px_rgba(31,42,36,0.25)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Start Fight
              </button>
              <span className="text-xs text-[#4a3f31]">
                Both trainers must select a Pokemon first.
              </span>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#1f2a24]/10 bg-white/80 p-6 shadow-[0_20px_50px_rgba(31,42,36,0.12)]">
            <h2 className="text-lg font-semibold">Latest Result</h2>
            {latestMatch ? (
              <div className="mt-4 flex flex-col gap-4">
                <div className="rounded-2xl border border-[#1f2a24]/10 bg-[#f8f3ea] p-4 text-sm">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#8a6f45]">
                    Winner
                  </p>
                  <p className="mt-2 font-semibold">
                    {getUserById(latestMatch.winnerId)?.name ?? "Trainer"}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#1f2a24]/10 bg-[#f8f3ea] p-4 text-sm">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#8a6f45]">
                    Battle
                  </p>
                  <p className="mt-2 text-[#4a3f31]">
                    {latestMatch.player1PokemonName} vs{" "}
                    {latestMatch.player2PokemonName}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-[#4a3f31]">
                No matches recorded yet. Start the first duel.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[32px] border border-[#1f2a24]/10 bg-white/80 p-6 shadow-[0_20px_50px_rgba(31,42,36,0.12)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Choose Your Pokemon</h2>
            {currentSelection && (
              <div className="flex items-center gap-3 text-sm text-[#4a3f31]">
                <span>Your pick</span>
                <div className="flex items-center gap-2 rounded-full border border-[#1f2a24]/20 bg-[#f8f3ea] px-3 py-1">
                  <Image
                    src={getPokemonImageUrl(currentSelection.pokemonId)}
                    alt={currentSelection.pokemonName}
                    width={32}
                    height={32}
                  />
                  <span className="capitalize">
                    {currentSelection.pokemonName}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredPokemons.map((pokemon) => {
              const pokemonId = pokemon.url.split("/")[6];
              const selected = currentSelection?.pokemonId === pokemonId;
              return (
                <button
                  key={pokemon.name}
                  onClick={() => handleSelectPokemon(pokemon)}
                  className={`group rounded-2xl border p-4 text-left transition ${
                    selected
                      ? "border-[#1f2a24] bg-[#1f2a24] text-[#f6f1e7]"
                      : "border-[#1f2a24]/10 bg-[#f8f3ea] hover:-translate-y-1"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#8a6f45] group-hover:text-[#8a6f45]">
                      #{pokemonId}
                    </p>
                    {selected && (
                      <span className="rounded-full bg-[#f6f1e7] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1f2a24]">
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-center">
                    <Image
                      src={getPokemonImageUrl(pokemonId)}
                      alt={pokemon.name}
                      width={96}
                      height={96}
                      className="drop-shadow"
                    />
                  </div>
                  <p
                    className={`mt-3 text-sm font-semibold capitalize ${
                      selected ? "text-[#f6f1e7]" : "text-[#1f2a24]"
                    }`}
                  >
                    {pokemon.name}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {sortedMatches.length > 0 && (
          <section className="rounded-[32px] border border-[#1f2a24]/10 bg-white/80 p-6 shadow-[0_20px_50px_rgba(31,42,36,0.12)]">
            <h2 className="text-lg font-semibold">Match History</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {sortedMatches.map((match) => (
                <div
                  key={match.id}
                  className="rounded-2xl border border-[#1f2a24]/10 bg-[#f8f3ea] p-4 text-sm"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-[#8a6f45]">
                    {new Date(match.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-2 font-semibold text-[#1f2a24]">
                    {getUserById(match.winnerId)?.name ?? "Trainer"} won
                  </p>
                  <p className="mt-1 text-[#4a3f31]">
                    {match.player1PokemonName} vs{" "}
                    {match.player2PokemonName}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
