"use client"

import { useRef, useState, useCallback } from "react"
import { ChevronsUp } from "lucide-react"

interface WindowSwipeProps {
  disabled: boolean
  onOpen: () => void
}

export default function WindowSwipe({ disabled, onOpen }: WindowSwipeProps) {
  const [progress, setProgress] = useState(0) // 0-1
  const [opened, setOpened] = useState(false)
  const startY = useRef<number | null>(null)
  const dragging = useRef(false)
  const THRESHOLD = 0.85

  const begin = useCallback((clientY: number) => {
    if (disabled || opened) return
    startY.current = clientY
    dragging.current = true
  }, [disabled, opened])

  const move = useCallback((clientY: number) => {
    if (!dragging.current || startY.current === null) return
    const delta = startY.current - clientY
    const maxDrag = 220
    const p = Math.min(1, Math.max(0, delta / maxDrag))
    setProgress(p)
    if (p >= THRESHOLD) {
      dragging.current = false
      setOpened(true)
      setProgress(1)
      onOpen()
    }
  }, [onOpen])

  const end = useCallback(() => {
    if (!opened) setProgress(0)
    dragging.current = false
  }, [opened])

  // Touch
  const onTouchStart = (e: React.TouchEvent) => begin(e.touches[0].clientY)
  const onTouchMove = (e: React.TouchEvent) => move(e.touches[0].clientY)

  // Mouse (for desktop preview)
  const onMouseDown = (e: React.MouseEvent) => {
    begin(e.clientY)
    const onMouseMove = (ev: MouseEvent) => move(ev.clientY)
    const onMouseUp = () => {
      end()
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  const blindHeight = Math.round((1 - progress) * 100)
  const handleY = Math.round(progress * 220)

  if (disabled) {
    return (
      <div className="flex flex-col items-center gap-3 select-none opacity-40">
        <div className="w-48 h-36 rounded-2xl border-4 border-white/30 bg-white/10 overflow-hidden relative">
          <div className="w-full bg-foreground/30" style={{ height: "100%" }} />
        </div>
        <p className="text-white/50 text-sm font-medium">雨1時間前に解放されます</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3 select-none touch-none" aria-label="窓を上にスワイプして開ける">
      {/* Window frame */}
      <div
        className="relative w-48 h-36 rounded-2xl border-4 overflow-hidden cursor-pointer"
        style={{
          borderColor: opened ? "rgba(250,204,21,0.8)" : "rgba(255,255,255,0.5)",
          boxShadow: opened
            ? "0 0 32px rgba(250,204,21,0.4)"
            : "0 4px 24px rgba(0,0,0,0.2)",
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={end}
      >
        {/* Sky visible behind blind */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-500" aria-hidden />
        {/* Horizontal blind slats */}
        {opened ? null : (
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-slate-200 to-slate-300 transition-none"
            style={{ height: `${blindHeight}%` }}
            aria-hidden
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-px bg-slate-400/40 w-full mt-3" aria-hidden />
            ))}
          </div>
        )}
        {opened && (
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
            <span className="text-4xl">🌤</span>
          </div>
        )}
      </div>

      {/* Swipe handle */}
      {!opened && (
        <div
          className="relative flex flex-col items-center gap-2"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={end}
          style={{ transform: `translateY(-${handleY}px)`, transition: dragging.current ? "none" : "transform 0.3s", touchAction: "none" }}
        >
          <div className="swipe-glow w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing">
            <ChevronsUp size={28} className="text-primary-foreground" />
          </div>
          <p className="text-white/70 text-xs font-medium whitespace-nowrap">上にスワイプ</p>
        </div>
      )}

      {opened && (
        <div className="flex items-center gap-2 text-yellow-300 font-bold text-base">
          <span>窓オープン！</span>
        </div>
      )}
    </div>
  )
}
