"use client"

import { useState, useEffect, useCallback } from "react"
import { History, X } from "lucide-react"
import WeatherHeader from "@/components/WeatherHeader"
import CountdownRing from "@/components/CountdownRing"
import WindowSwipe from "@/components/WindowSwipe"
import TShirtSwipe from "@/components/TShirtSwipe"
import ScoreDisplay from "@/components/ScoreDisplay"
import PartnerPanel from "@/components/PartnerPanel"
import ScoreHistory from "@/components/ScoreHistory"

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = "safe" | "warning" | "window" | "rained"

interface AppState {
  windowOpen: boolean
  collected: boolean
  phase: Phase
  remainingMinutes: number
  score: number
  rank: "S" | "A" | "B" | "C" | "F"
  collectMinutesBefore: number
  showHistory: boolean
  partnerCollected: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_MINUTES = 70  // For debug: 1h10m (was 180)
const WINDOW_MINUTES = 60   // window opens at 60 min before rain

const HISTORY = [
  { date: "4/7", score: 9800, rank: "S" as const, minutesBefore: 3, partnerWon: false },
  { date: "4/5", score: 7200, rank: "A" as const, minutesBefore: 18, partnerWon: false },
  { date: "4/3", score: 5400, rank: "B" as const, minutesBefore: 35, partnerWon: true },
  { date: "3/31", score: 3100, rank: "C" as const, minutesBefore: 52, partnerWon: false },
  { date: "3/28", score: 8950, rank: "A" as const, minutesBefore: 11, partnerWon: false },
]

const PARTNER = {
  name: "ゆい",
  avatar: "Y",
  score: null as number | null,
  collected: false,
}

// ─── Score calculation ────────────────────────────────────────────────────────

function calcScore(minutesBefore: number): { score: number; rank: "S" | "A" | "B" | "C" | "F" } {
  if (minutesBefore <= 5) return { score: 9999, rank: "S" }
  if (minutesBefore <= 15) return { score: Math.round(8000 + (15 - minutesBefore) * 133), rank: "A" }
  if (minutesBefore <= 30) return { score: Math.round(6000 + (30 - minutesBefore) * 133), rank: "B" }
  if (minutesBefore <= 55) return { score: Math.round(3000 + (55 - minutesBefore) * 120), rank: "C" }
  return { score: 500, rank: "F" }
}

function getPhase(remaining: number): Phase {
  if (remaining <= 0) return "rained"
  if (remaining <= WINDOW_MINUTES) return "window"
  if (remaining <= WINDOW_MINUTES + 20) return "warning"
  return "safe"
}

// ─── Background gradient ──────────────────────────────────────────────────────

const BG: Record<Phase, string> = {
  safe: "from-[oklch(0.52_0.17_228)] via-[oklch(0.40_0.17_238)] to-[oklch(0.30_0.15_250)]",
  warning: "from-[oklch(0.42_0.16_240)] via-[oklch(0.34_0.18_250)] to-[oklch(0.25_0.16_260)]",
  window: "from-[oklch(0.36_0.15_250)] via-[oklch(0.28_0.18_260)] to-[oklch(0.20_0.14_270)]",
  rained: "from-[oklch(0.22_0.06_240)] via-[oklch(0.18_0.05_245)] to-[oklch(0.14_0.04_250)]",
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SentakuApp() {
  const [state, setState] = useState<AppState>({
    windowOpen: false,
    collected: false,
    phase: "safe",
    remainingMinutes: TOTAL_MINUTES,
    score: 0,
    rank: "C",
    collectMinutesBefore: 0,
    showHistory: false,
    partnerCollected: false,
  })

  // Simulate countdown (demo: 1 real second = 1 demo minute)
  useEffect(() => {
    if (state.collected || state.phase === "rained") return
    const timer = setInterval(() => {
      setState((prev) => {
        const next = Math.max(0, prev.remainingMinutes - 1)
        return { ...prev, remainingMinutes: next, phase: getPhase(next) }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [state.collected, state.phase])

  const handleWindowOpen = useCallback(() => {
    setState((prev) => ({ ...prev, windowOpen: true }))
  }, [])

  const handleCollect = useCallback(() => {
    setState((prev) => {
      const minutesBefore = prev.remainingMinutes
      const { score, rank } = calcScore(minutesBefore)
      // Simulate partner reaction (random)
      const partnerWon = false
      return {
        ...prev,
        collected: true,
        score,
        rank,
        collectMinutesBefore: minutesBefore,
        partnerCollected: partnerWon,
      }
    })
  }, [])

  const handleReset = useCallback(() => {
    setState({
      windowOpen: false,
      collected: false,
      phase: "safe",
      remainingMinutes: TOTAL_MINUTES,
      score: 0,
      rank: "C",
      collectMinutesBefore: 0,
      showHistory: false,
      partnerCollected: false,
    })
  }, [])

  // Compute rainTime only on the client to avoid SSR/client hydration mismatch
  const [rainTime, setRainTime] = useState<Date | null>(null)
  useEffect(() => {
    setRainTime(new Date(Date.now() + state.remainingMinutes * 60 * 1000))
  }, [state.remainingMinutes])
  const windowUnlocked = state.phase === "window" || state.phase === "rained"

  const totalScore = HISTORY.reduce((s, e) => s + e.score, 0) + (state.collected ? state.score : 0)
  const streak = 5

  return (
    <main
      className={`min-h-screen bg-gradient-to-b ${BG[state.phase]} flex flex-col font-sans transition-all duration-1000`}
      aria-label="センタク アプリ"
    >
      {/* ── Status Bar spacer ── */}
      <div className="h-10" aria-hidden />

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 mb-1">
        <h1 className="text-white font-black text-2xl tracking-tight">センタク</h1>
        <button
          onClick={() => setState((s) => ({ ...s, showHistory: !s.showHistory }))}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center"
          aria-label="履歴を開く"
        >
          {state.showHistory ? (
            <X size={18} className="text-white" />
          ) : (
            <History size={18} className="text-white" />
          )}
        </button>
      </div>

      {/* ── Weather Info ── */}
      <WeatherHeader
        location="東京・渋谷区"
        temperature={18}
        humidity={72}
        windSpeed={3.2}
        rainTime={rainTime}
        remainingMinutes={state.remainingMinutes}
        phase={state.phase}
      />

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">

        {state.showHistory ? (
          /* ─ History view ─ */
          <ScoreHistory
            entries={HISTORY}
            totalScore={totalScore}
            streak={streak}
          />
        ) : (
          <>
            {/* ─ Countdown ─ */}
            {!state.collected && (
              <div className="flex justify-center">
                <CountdownRing
                  totalMinutes={TOTAL_MINUTES}
                  remainingMinutes={state.remainingMinutes}
                  windowMinutes={WINDOW_MINUTES}
                  phase={state.phase}
                />
              </div>
            )}

            {/* ─ Window unlock banner ─ */}
            {windowUnlocked && !state.collected && (
              <div className="rounded-2xl bg-yellow-400/20 border border-yellow-400/40 px-4 py-3 text-center">
                <p className="text-yellow-300 font-bold text-sm">
                  {state.phase === "rained" ? "雨が降っています — 今日はアウト" : "今だ！窓を開けて取り込もう"}
                </p>
              </div>
            )}

            {/* ─ Phase 1: Window swipe ─ */}
            {!state.windowOpen && !state.collected && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-white/60 text-sm text-center mb-1">
                  {windowUnlocked ? "窓を開けてください" : `あと${state.remainingMinutes - WINDOW_MINUTES}分で窓が解放されます`}
                </p>
                <WindowSwipe disabled={!windowUnlocked} onOpen={handleWindowOpen} />
              </div>
            )}

            {/* ─ Phase 2: Laundry swipe ─ */}
            {state.windowOpen && !state.collected && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-white/60 text-sm text-center">洗濯物を取り込んでください</p>
                <TShirtSwipe onCollect={handleCollect} collected={false} />
              </div>
            )}

            {/* ─ Result ─ */}
            {state.collected && (
              <div className="flex flex-col gap-5">
                <ScoreDisplay
                  score={state.score}
                  maxScore={9999}
                  rank={state.rank}
                  label={`雨の${state.collectMinutesBefore}分前に取り込んだ！`}
                />

                <PartnerPanel
                  partner={{ ...PARTNER, collected: state.partnerCollected }}
                  myCollected={state.collected}
                />

                <button
                  onClick={handleReset}
                  className="w-full rounded-2xl bg-white/10 border border-white/20 text-white/70 py-3.5 font-medium text-sm hover:bg-white/20 transition-colors"
                >
                  もう一度プレイ（デモリセット）
                </button>
              </div>
            )}

            {/* ─ Partner panel (always visible once window open) ─ */}
            {state.windowOpen && !state.collected && (
              <PartnerPanel
                partner={{ ...PARTNER, collected: false }}
                myCollected={false}
              />
            )}
          </>
        )}
      </div>

      {/* ── Bottom nav ── */}
      <nav
        className="flex items-center justify-around border-t border-white/10 bg-black/20 backdrop-blur-sm px-6 py-4"
        aria-label="ナビゲーション"
      >
        <NavItem
          active={!state.showHistory}
          label="今日"
          onClick={() => setState((s) => ({ ...s, showHistory: false }))}
          icon={
            <svg width="22" height="22" viewBox="0 0 100 100" fill="none" aria-hidden>
              <path
                d="M30 40 L10 30 L20 15 L35 25 Q50 30 65 25 L80 15 L90 30 L70 40 L70 85 L30 85 Z"
                fill="currentColor"
              />
            </svg>
          }
        />
        <NavItem
          active={state.showHistory}
          label="履歴"
          onClick={() => setState((s) => ({ ...s, showHistory: true }))}
          icon={<History size={22} />}
        />
      </nav>
    </main>
  )
}

function NavItem({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean
  label: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${
        active ? "text-primary" : "text-white/40"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
