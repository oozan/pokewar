import React from "react";

interface ButtonProps {
  variant: "start" | "cancel" | "new";
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant, onClick, children }) => {
  const baseStyles =
    "px-4 py-2 font-bold rounded-md shadow-lg transition transform hover:scale-105";

  const variantStyles = {
    start: "bg-red-500 text-white hover:bg-red-400",
    cancel: "bg-gray-300 text-gray-700 hover:bg-gray-400",
    new: "bg-blue-500 text-white hover:bg-blue-400",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;
