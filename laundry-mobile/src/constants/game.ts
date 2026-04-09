// ─── Game Constants ──────────────────────────────────────────────────────────

export const TOTAL_MINUTES = 70   // デモ用: 1h10m
export const WINDOW_MINUTES = 60  // 雨60分前に窓が開く

export type Phase = 'safe' | 'warning' | 'window' | 'rained'
export type Rank = 'S' | 'A' | 'B' | 'C' | 'F'

export interface HistoryEntry {
  date: string
  score: number
  rank: Rank
  minutesBefore: number
  partnerWon: boolean
}

export interface Partner {
  name: string
  avatar: string
  score: number | null
  collected: boolean
}

export const HISTORY: HistoryEntry[] = [
  { date: '4/7', score: 9800, rank: 'S', minutesBefore: 3, partnerWon: false },
  { date: '4/5', score: 7200, rank: 'A', minutesBefore: 18, partnerWon: false },
  { date: '4/3', score: 5400, rank: 'B', minutesBefore: 35, partnerWon: true },
  { date: '3/31', score: 3100, rank: 'C', minutesBefore: 52, partnerWon: false },
  { date: '3/28', score: 8950, rank: 'A', minutesBefore: 11, partnerWon: false },
]

export const DEFAULT_PARTNER: Partner = {
  name: 'ゆい',
  avatar: 'Y',
  score: null,
  collected: false,
}

// ─── Score Calculation ───────────────────────────────────────────────────────

export function calcScore(minutesBefore: number): { score: number; rank: Rank } {
  if (minutesBefore <= 5) return { score: 9999, rank: 'S' }
  if (minutesBefore <= 15) return { score: Math.round(8000 + (15 - minutesBefore) * 133), rank: 'A' }
  if (minutesBefore <= 30) return { score: Math.round(6000 + (30 - minutesBefore) * 133), rank: 'B' }
  if (minutesBefore <= 55) return { score: Math.round(3000 + (55 - minutesBefore) * 120), rank: 'C' }
  return { score: 500, rank: 'F' }
}

export function getPhase(remaining: number): Phase {
  if (remaining <= 0) return 'rained'
  if (remaining <= WINDOW_MINUTES) return 'window'
  if (remaining <= WINDOW_MINUTES + 20) return 'warning'
  return 'safe'
}
