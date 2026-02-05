import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { fetchPokemons, getPokemonImageUrl } from "../lib/pokemonService";
import PokemonCard from "../components/pokemon-card/pokemon-card";
import SearchBar from "../components/search-bar/search-bar";
import Button from "@/components/button/button";

interface Pokemon {
  name: string;
  url: string;
}

export default function Play() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [player1, setPlayer1] = useState<Pokemon | null>(null);
  const [player2, setPlayer2] = useState<Pokemon | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadPokemons = async () => {
      const data = await fetchPokemons(1000);
      setPokemons(data);
      setFilteredPokemons(data);
    };
    loadPokemons();
  }, []);

  const handleSelectClick = (pokemon: Pokemon) => {
    if (!player1) {
      setPlayer1(pokemon);
    } else if (!player2 && pokemon.name !== player1.name) {
      setPlayer2(pokemon);
      setIsModalVisible(true);
    }
  };

  const startBattle = () => {
    if (player1 && player2) {
      const player1Id = player1.url.split("/")[6];
      const player2Id = player2.url.split("/")[6];

      router.push({
        pathname: "/battle",
        query: {
          player1: player1Id,
          player2: player2Id,
        },
      });
    }
  };

  const handleCancel = () => {
    setPlayer1(null);
    setPlayer2(null);
    setIsModalVisible(false);
  };

  const isPokemonDisabled = (pokemon: Pokemon): boolean => {
    return player1?.name === pokemon.name || player2?.name === pokemon.name;
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredPokemons(pokemons);
    } else {
      const filtered = pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPokemons(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
            Solo Arena
          </p>
          <h1 className="text-4xl font-bold text-gray-900">PokeWar</h1>
          <p className="mt-2 text-sm text-gray-600">
            Choose two challengers and let fate decide the winner.
          </p>
        </div>
        <Button variant="new" onClick={() => router.push("/")}>
          Back to Landing
        </Button>
      </div>
      <SearchBar onSearch={handleSearch} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {filteredPokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.name}
            name={pokemon.name}
            imageUrl={getPokemonImageUrl(pokemon.url.split("/")[6])}
            isDisabled={isPokemonDisabled(pokemon)}
            onSelectClick={() => handleSelectClick(pokemon)}
          />
        ))}
      </div>

      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/75">
          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-black">
              Ready to Battle?
            </h2>
            <p className="mb-4 text-black">
              You have selected{" "}
              <span className="font-bold capitalize">{player1?.name}</span> and{" "}
              <span className="font-bold capitalize">{player2?.name}</span>.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="start" onClick={startBattle}>
                Start Battle
              </Button>
              <Button variant="cancel" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
