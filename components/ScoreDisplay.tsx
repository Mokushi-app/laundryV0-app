"use client"

import { useEffect, useState } from "react"

interface ScoreDisplayProps {
  score: number
  maxScore: number
  rank: "S" | "A" | "B" | "C" | "F"
  label: string
}

const RANK_CONFIG = {
  S: { color: "text-yellow-400", bg: "bg-yellow-400/20", border: "border-yellow-400/50", glow: "shadow-yellow-400/30" },
  A: { color: "text-green-400", bg: "bg-green-400/20", border: "border-green-400/50", glow: "shadow-green-400/30" },
  B: { color: "text-blue-400", bg: "bg-blue-400/20", border: "border-blue-400/50", glow: "shadow-blue-400/30" },
  C: { color: "text-slate-300", bg: "bg-slate-400/20", border: "border-slate-400/50", glow: "shadow-slate-400/20" },
  F: { color: "text-red-400", bg: "bg-red-400/20", border: "border-red-400/50", glow: "shadow-red-400/20" },
}

export default function ScoreDisplay({ score, maxScore, rank, label }: ScoreDisplayProps) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    let start = 0
    const step = score / 40
    const timer = setInterval(() => {
      start += step
      if (start >= score) {
        setDisplayed(score)
        clearInterval(timer)
      } else {
        setDisplayed(Math.round(start))
      }
    }, 30)
    return () => clearInterval(timer)
  }, [score])

  const cfg = RANK_CONFIG[rank]
  const pct = Math.min(100, (score / maxScore) * 100)

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Rank badge */}
      <div
        className={`w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-xl ${cfg.bg} ${cfg.border} ${cfg.glow}`}
        aria-label={`ランク ${rank}`}
      >
        <span className={`text-4xl font-black ${cfg.color}`}>{rank}</span>
      </div>

      {/* Score */}
      <div className="text-center">
        <div className="text-5xl font-black text-white tabular-nums" aria-live="polite">
          {displayed.toLocaleString()}
        </div>
        <div className="text-white/50 text-sm mt-1">{label}</div>
      </div>

      {/* Score bar */}
      <div className="w-64 h-3 bg-white/10 rounded-full overflow-hidden" aria-hidden>
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            rank === "S"
              ? "bg-gradient-to-r from-yellow-400 to-orange-400"
              : rank === "A"
              ? "bg-gradient-to-r from-green-400 to-teal-400"
              : "bg-gradient-to-r from-blue-400 to-indigo-400"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Max score note */}
      <span className="text-white/30 text-xs">最高 {maxScore.toLocaleString()} pts</span>
    </div>
  )
}
