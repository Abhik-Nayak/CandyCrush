"use client";

import { useState, useEffect } from "react";
import { useGameState } from "@/hooks/useGameState";
import GameBoard from "./GameBoard";
import ScorePanel from "./ScorePanel";
import GameOverModal from "./GameOverModal";
import LevelCompleteModal from "./LevelCompleteModal";

export default function GameContainer() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const {
    board,
    score,
    moves,
    level,
    targetScore,
    combo,
    phase,
    selected,
    hintCells,
    showLevelComplete,
    handleCellClick,
    resetGame,
    nextLevel,
    showHint,
  } = useGameState();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Candy Crush
        </h1>
        <p className="text-purple-300/70 text-sm mt-3 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex flex-col items-center px-2 py-3 sm:px-4 sm:py-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-2 sm:mb-3 shrink-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl">
          Candy Crush
        </h1>
        <p className="text-purple-300/70 text-xs mt-0.5">Match 3 or more to score!</p>
      </div>

      {/* Score Panel */}
      <div className="relative z-10 w-full max-w-[500px] mb-2 sm:mb-3 shrink-0">
        <ScorePanel
          score={score}
          targetScore={targetScore}
          moves={moves}
          level={level}
          combo={combo}
        />
      </div>

      {/* Game Board — fills remaining space, capped width */}
      <div className="relative z-10 flex-1 w-full max-w-[500px] min-h-0 flex items-center justify-center">
        <div className="w-full max-h-full aspect-square">
          <GameBoard
            board={board}
            selected={selected}
            hintCells={hintCells}
            onCellClick={handleCellClick}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="relative z-10 flex gap-3 mt-2 shrink-0">
        <button
          onClick={showHint}
          disabled={phase !== "idle"}
          className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium text-sm hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95"
        >
          💡 Hint
        </button>
        <button
          onClick={resetGame}
          className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium text-sm hover:bg-white/20 transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95"
        >
          🔄 New Game
        </button>
      </div>

      {/* How to play */}
      <div className="relative z-10 mt-1 text-center max-w-xs shrink-0">
        <p className="text-purple-400/50 text-[10px] sm:text-xs">
          Click a candy, then click an adjacent candy to swap. Match 3+ in a row to score!
        </p>
      </div>

      {/* Modals */}
      {phase === "gameover" && (
        <GameOverModal score={score} level={level} onRestart={resetGame} />
      )}
      {showLevelComplete && (
        <LevelCompleteModal score={score} level={level} onNextLevel={nextLevel} />
      )}
    </div>
  );
}
