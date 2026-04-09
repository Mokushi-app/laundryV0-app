"use client"

import { useEffect, useRef } from "react"

interface CountdownRingProps {
  totalMinutes: number
  remainingMinutes: number
  windowMinutes: number // e.g. 60 – opens the window
  phase: "safe" | "warning" | "window" | "rained"
}

export default function CountdownRing({
  totalMinutes,
  remainingMinutes,
  windowMinutes,
  phase,
}: CountdownRingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const SIZE = 180
  const STROKE = 12
  const R = (SIZE - STROKE) / 2
  const CIRC = 2 * Math.PI * R

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = SIZE * dpr
    canvas.height = SIZE * dpr
    canvas.style.width = `${SIZE}px`
    canvas.style.height = `${SIZE}px`
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, SIZE, SIZE)
    const cx = SIZE / 2
    const cy = SIZE / 2

    // Track
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, 2 * Math.PI)
    ctx.strokeStyle = "rgba(255,255,255,0.15)"
    ctx.lineWidth = STROKE
    ctx.stroke()

    // Window zone (highlight)
    const windowFraction = windowMinutes / totalMinutes
    const windowStart = -Math.PI / 2 + (1 - windowFraction) * 2 * Math.PI
    const windowEnd = 3 * Math.PI / 2
    ctx.beginPath()
    ctx.arc(cx, cy, R, windowStart, windowEnd)
    ctx.strokeStyle = "rgba(255,210,60,0.35)"
    ctx.lineWidth = STROKE + 4
    ctx.lineCap = "round"
    ctx.stroke()

    // Progress arc
    const progress = Math.max(0, remainingMinutes / totalMinutes)
    const arcEnd = -Math.PI / 2 + progress * 2 * Math.PI
    const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE)
    if (phase === "window") {
      grad.addColorStop(0, "#facc15")
      grad.addColorStop(1, "#f97316")
    } else if (phase === "rained") {
      grad.addColorStop(0, "#6b7280")
      grad.addColorStop(1, "#374151")
    } else {
      grad.addColorStop(0, "#60a5fa")
      grad.addColorStop(1, "#818cf8")
    }
    ctx.beginPath()
    ctx.arc(cx, cy, R, -Math.PI / 2, arcEnd)
    ctx.strokeStyle = grad
    ctx.lineWidth = STROKE
    ctx.lineCap = "round"
    ctx.stroke()
  }, [remainingMinutes, totalMinutes, windowMinutes, phase])

  const hrs = Math.floor(remainingMinutes / 60)
  const mins = remainingMinutes % 60

  const phaseLabel: Record<typeof phase, { text: string; color: string }> = {
    safe: { text: "安全", color: "text-blue-200" },
    warning: { text: "準備して", color: "text-yellow-300" },
    window: { text: "今すぐ！", color: "text-yellow-400" },
    rained: { text: "雨中", color: "text-gray-400" },
  }

  return (
    <div className="relative flex items-center justify-center" aria-label={`残り時間 ${hrs}時間${mins}分`}>
      <canvas ref={canvasRef} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span className={`text-xs font-semibold uppercase tracking-widest ${phaseLabel[phase].color}`}>
          {phaseLabel[phase].text}
        </span>
        {phase !== "rained" ? (
          <span className="text-white font-black text-3xl leading-none tabular-nums">
            {hrs > 0 ? `${hrs}:${String(mins).padStart(2, "0")}` : `${mins}分`}
          </span>
        ) : (
          <span className="text-gray-300 font-black text-2xl">---</span>
        )}
        <span className="text-white/50 text-xs">雨まで</span>
      </div>
    </div>
  )
}
