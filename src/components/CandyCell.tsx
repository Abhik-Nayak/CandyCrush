"use client";

import { Cell } from "@/utils/gameLogic";

interface CandyCellProps {
  cell: Cell;
  isSelected: boolean;
  isHint: boolean;
  onClick: () => void;
}

const candyIcons: Record<string, string> = {
  red: "💎",
  blue: "🫐",
  green: "🍀",
  yellow: "⭐",
  purple: "🍇",
  orange: "🍊",
};

export default function CandyCell({ cell, isSelected, isHint, onClick }: CandyCellProps) {
  const { candy, isMatched, isNew, isFalling } = cell;

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full aspect-square rounded-xl
        flex items-center justify-center
        text-2xl sm:text-3xl md:text-4xl
        transition-all duration-200 ease-out
        cursor-pointer select-none
        transform hover:scale-110 active:scale-95
        ${isSelected
          ? `ring-4 ring-white ring-offset-2 ring-offset-purple-900 scale-110 z-10 shadow-lg ${candy.glow}`
          : "hover:shadow-md"
        }
        ${isHint ? "animate-hint" : ""}
        ${isMatched ? "animate-match scale-0 opacity-0" : ""}
        ${isNew ? "animate-drop-in" : ""}
        ${isFalling ? "animate-fall" : ""}
        bg-gradient-to-br ${candy.gradient}
        shadow-md hover:shadow-xl
        border-2 border-white/20
        backdrop-blur-sm
      `}
      aria-label={`${candy.name} candy at row ${cell.row}, column ${cell.col}`}
    >
      <span className="drop-shadow-md filter">{candyIcons[candy.name]}</span>
      {isSelected && (
        <span className="absolute inset-0 rounded-xl bg-white/20 animate-pulse" />
      )}
      {isMatched && (
        <span className="absolute inset-0 rounded-xl bg-white/60 animate-ping" />
      )}
    </button>
  );
}
