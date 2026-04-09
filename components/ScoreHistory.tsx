"use client"

interface HistoryEntry {
  date: string
  score: number
  rank: "S" | "A" | "B" | "C" | "F"
  minutesBefore: number
  partnerWon: boolean
}

const RANK_DOT: Record<HistoryEntry["rank"], string> = {
  S: "bg-yellow-400",
  A: "bg-green-400",
  B: "bg-blue-400",
  C: "bg-slate-400",
  F: "bg-red-400",
}

const RANK_TEXT: Record<HistoryEntry["rank"], string> = {
  S: "text-yellow-400",
  A: "text-green-400",
  B: "text-blue-400",
  C: "text-slate-400",
  F: "text-red-400",
}

interface ScoreHistoryProps {
  entries: HistoryEntry[]
  totalScore: number
  streak: number
}

export default function ScoreHistory({ entries, totalScore, streak }: ScoreHistoryProps) {
  const maxScore = Math.max(...entries.map((e) => e.score), 1)

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/10 border border-white/20 p-4 flex flex-col gap-1">
          <span className="text-white/50 text-xs">累計スコア</span>
          <span className="text-white font-black text-2xl tabular-nums">{totalScore.toLocaleString()}</span>
        </div>
        <div className="rounded-2xl bg-white/10 border border-white/20 p-4 flex flex-col gap-1">
          <span className="text-white/50 text-xs">連続取り込み</span>
          <span className="text-white font-black text-2xl tabular-nums">{streak}<span className="text-base font-medium text-white/60 ml-1">日</span></span>
        </div>
      </div>

      {/* History list */}
      <div className="rounded-2xl bg-white/10 border border-white/20 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <span className="text-white/70 text-sm font-semibold">履歴</span>
        </div>
        <div className="divide-y divide-white/10">
          {entries.map((entry, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              {/* Rank dot */}
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${RANK_DOT[entry.rank]}`} aria-hidden />

              {/* Date */}
              <span className="text-white/60 text-xs w-20 flex-shrink-0">{entry.date}</span>

              {/* Mini bar */}
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    entry.rank === "S"
                      ? "bg-yellow-400"
                      : entry.rank === "A"
                      ? "bg-green-400"
                      : "bg-blue-400"
                  }`}
                  style={{ width: `${(entry.score / maxScore) * 100}%` }}
                  aria-hidden
                />
              </div>

              {/* Score */}
              <span className={`text-sm font-bold w-16 text-right tabular-nums ${RANK_TEXT[entry.rank]}`}>
                {entry.score.toLocaleString()}
              </span>

              {/* Time label */}
              <span className="text-white/30 text-xs w-14 text-right">
                {entry.minutesBefore}分前
              </span>

              {/* Rank */}
              <span className={`text-xs font-black w-5 text-center ${RANK_TEXT[entry.rank]}`}>
                {entry.rank}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
