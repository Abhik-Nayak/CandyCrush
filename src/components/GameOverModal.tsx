"use client";

interface GameOverModalProps {
  score: number;
  level: number;
  onRestart: () => void;
}

export default function GameOverModal({ score, level, onRestart }: GameOverModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-purple-500/30 animate-scale-in">
        {/* Decorative elements */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl">😢</div>

        <div className="text-center pt-4">
          <h2 className="text-3xl font-extrabold text-white mb-2">Game Over</h2>
          <p className="text-purple-300 mb-6">No more moves left!</p>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-white/10">
              <span className="text-purple-300">Final Score</span>
              <span className="text-xl font-bold text-white">{score.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-white/10">
              <span className="text-purple-300">Level Reached</span>
              <span className="text-xl font-bold text-yellow-400">{level}</span>
            </div>
          </div>

          <button
            onClick={onRestart}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold text-lg shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transform hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Play Again 🎮
          </button>
        </div>
      </div>
    </div>
  );
}
