"use client";

interface ScorePanelProps {
  score: number;
  targetScore: number;
  moves: number;
  level: number;
  combo: number;
}

export default function ScorePanel({ score, targetScore, moves, level, combo }: ScorePanelProps) {
  const progress = Math.min((score / targetScore) * 100, 100);

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {/* Level badge */}
      <div className="flex items-center justify-center gap-2">
        <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-500/30">
          Level {level}
        </span>
        {combo > 1 && (
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold text-sm animate-bounce shadow-lg shadow-pink-500/30">
            🔥 x{combo} Combo!
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 text-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
          <div className="text-xs uppercase tracking-wider text-purple-300 font-medium">Score</div>
          <div className="text-2xl font-bold text-white tabular-nums">{score.toLocaleString()}</div>
        </div>
        <div className="flex-1 text-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
          <div className="text-xs uppercase tracking-wider text-purple-300 font-medium">Target</div>
          <div className="text-2xl font-bold text-yellow-400 tabular-nums">{targetScore.toLocaleString()}</div>
        </div>
        <div className="flex-1 text-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
          <div className="text-xs uppercase tracking-wider text-purple-300 font-medium">Moves</div>
          <div className={`text-2xl font-bold tabular-nums ${moves <= 5 ? "text-red-400 animate-pulse" : "text-white"}`}>
            {moves}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-4 rounded-full bg-purple-900/60 border border-purple-500/30 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-bold text-white drop-shadow-md">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}
