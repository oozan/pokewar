import React from "react";
import Image from "next/image";

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-900 via-purple-900 to-gray-900 text-white">
      <h2 className="text-4xl font-bold mb-6">Loading...</h2>
      <div className="animate-bounce">
        <Image
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
          alt="Pikachu"
          width={128}
          height={128}
        />
      </div>
    </div>
  );
};

export default Loading;
