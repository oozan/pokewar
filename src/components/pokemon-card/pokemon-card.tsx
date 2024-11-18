import React from "react";
import Image from "next/image";

interface PokemonCardProps {
  name: string;
  imageUrl: string;
  isDisabled: boolean;
  onSelectClick: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({
  name,
  imageUrl,
  isDisabled,
  onSelectClick,
}) => {
  return (
    <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg hover:scale-105 transition transform duration-300 flex flex-col items-center">
      <div className="w-24 h-24">
        <Image
          src={imageUrl}
          alt={name}
          width={192}
          height={192}
          className="object-contain"
        />
      </div>
      <h2 className="text-lg font-bold text-white capitalize mt-2">{name}</h2>
      <div className="mt-4">
        <button
          onClick={onSelectClick}
          disabled={isDisabled}
          className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-md ${
            isDisabled
              ? "bg-gray-400 text-gray-800 cursor-not-allowed"
              : "bg-yellow-500 text-white hover:bg-yellow-400 transition"
          }`}
        >
          {isDisabled ? "Selected" : "Select"}
        </button>
      </div>
    </div>
  );
};

export default PokemonCard;
