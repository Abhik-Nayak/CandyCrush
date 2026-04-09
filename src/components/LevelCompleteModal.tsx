"use client";

interface LevelCompleteModalProps {
  score: number;
  level: number;
  onNextLevel: () => void;
}

export default function LevelCompleteModal({ score, level, onNextLevel }: LevelCompleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-gradient-to-br from-yellow-600 via-orange-600 to-pink-700 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-yellow-400/30 animate-scale-in">
        {/* Decorative elements */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl">🎉</div>

        <div className="text-center pt-4">
          <h2 className="text-3xl font-extrabold text-white mb-2">Level Complete!</h2>
          <p className="text-yellow-200 mb-6">Amazing job!</p>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-white/10">
              <span className="text-yellow-200">Score</span>
              <span className="text-xl font-bold text-white">{score.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-white/10">
              <span className="text-yellow-200">Level Cleared</span>
              <span className="text-xl font-bold text-white">{level}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-white/10">
              <span className="text-yellow-200">Next Level</span>
              <span className="text-xl font-bold text-white">Level {level + 1} ➜</span>
            </div>
          </div>

          <button
            onClick={onNextLevel}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transform hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Next Level 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
