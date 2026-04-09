"use client";

import { Board } from "@/utils/gameLogic";
import CandyCell from "./CandyCell";

interface GameBoardProps {
  board: Board;
  selected: { row: number; col: number } | null;
  hintCells: [number, number][] | null;
  onCellClick: (row: number, col: number) => void;
}

export default function GameBoard({ board, selected, hintCells, onCellClick }: GameBoardProps) {
  const isHint = (row: number, col: number) => {
    if (!hintCells) return false;
    return hintCells.some(([r, c]) => r === row && c === col);
  };

  return (
    <div className="relative p-3 sm:p-4 rounded-2xl bg-purple-900/50 backdrop-blur-md border border-purple-500/30 shadow-2xl">
      {/* Background glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10 blur-xl" />

      <div
        className="relative grid gap-1.5 sm:gap-2"
        style={{
          gridTemplateColumns: `repeat(${board[0]?.length || 8}, 1fr)`,
        }}
      >
        {board.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <CandyCell
              key={cell.id}
              cell={cell}
              isSelected={selected?.row === rowIdx && selected?.col === colIdx}
              isHint={isHint(rowIdx, colIdx)}
              onClick={() => onCellClick(rowIdx, colIdx)}
            />
          ))
        )}
      </div>
    </div>
  );
}
