import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Loading from "../../components/loader/loader";
import Button from "../../components/button/button";
import { getPokemonImageUrl } from "@/lib/pokemonService";

const BattlePage = () => {
  const router = useRouter();
  const { player1, player2 } = router.query;

  const [winner, setWinner] = useState<string | null>(null);
  const [player1Name, setPlayer1Name] = useState<string | null>(null);
  const [player2Name, setPlayer2Name] = useState<string | null>(null);

  const safeQueryString = (
    param: string | string[] | undefined
  ): string | null => {
    return Array.isArray(param) ? param[0] : param || null;
  };

  const player1Id = safeQueryString(player1);
  const player2Id = safeQueryString(player2);

  useEffect(() => {
    if (player1Id && player2Id) {
      const fetchPokemonNames = async () => {
        try {
          const response1 = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${player1Id}`
          );
          const data1 = await response1.json();
          setPlayer1Name(data1.name);

          const response2 = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${player2Id}`
          );
          const data2 = await response2.json();
          setPlayer2Name(data2.name);
        } catch (error) {
          console.error("Error fetching Pokémon names:", error);
        }
      };

      fetchPokemonNames();

      const decideWinner = () => {
        const winner = Math.random() > 0.5 ? player1Id : player2Id;
        setTimeout(() => setWinner(winner as string), 3000);
      };
      decideWinner();
    } else {
      router.push("/play");
    }
  }, [player1Id, player2Id, router]);

  if (!player1Id || !player2Id || !player1Name || !player2Name) {
    return <Loading />;
  }

  const capitalizeName = (name: string | null) =>
    name ? name.charAt(0).toUpperCase() + name.slice(1) : "";

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center text-white">
      {winner && (
        <h1 className="absolute top-10 text-5xl font-bold text-blue-400">
          {winner === player1Id
            ? `${capitalizeName(player1Name)} Wins!`
            : `${capitalizeName(player2Name)} Wins!`}
        </h1>
      )}
      <h1 className="text-6xl font-extrabold mb-10 text-yellow-400">
        Battle Time!
      </h1>
      <div className="relative flex items-center justify-between w-full max-w-4xl">
        <div className="relative flex flex-col items-center">
          {winner === player1Id && (
            <span className="absolute top-[-20px] text-lg font-bold bg-green-500 text-white py-1 px-3 rounded-md">
              Winner
            </span>
          )}
          <Image
            src={getPokemonImageUrl(player1Id)}
            alt={`Pokemon: ${capitalizeName(player1Name)}`}
            width={256}
            height={256}
            className={`transition-transform duration-500 ${
              winner && winner !== player1Id ? "opacity-50" : "animate-bounce"
            }`}
          />
          <h3 className="text-xl mt-4 capitalize tracking-wide">
            {capitalizeName(player1Name)}
          </h3>
        </div>

        <h2 className="text-6xl font-bold text-gray-300 mx-6">VS</h2>

        <div className="relative flex flex-col items-center">
          {winner === player2Id && (
            <span className="absolute top-[-20px] text-lg font-bold bg-green-500 text-white py-1 px-3 rounded-md">
              Winner
            </span>
          )}
          <Image
            src={getPokemonImageUrl(player2Id)}
            alt={`Pokemon: ${capitalizeName(player2Name)}`}
            width={256}
            height={256}
            className={`transition-transform duration-500 ${
              winner && winner !== player2Id ? "opacity-50" : "animate-bounce"
            }`}
          />
          <h3 className="text-xl mt-4 capitalize tracking-wide">
            {capitalizeName(player2Name)}
          </h3>
        </div>
      </div>

      {winner && (
        <div className="absolute bottom-10">
          <Button variant="new" onClick={() => router.push("/play")}>
            Start New Battle
          </Button>
        </div>
      )}
    </div>
  );
};

export default BattlePage;
