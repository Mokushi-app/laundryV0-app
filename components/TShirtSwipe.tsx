"use client"

import { useRef, useState, useCallback } from "react"
import { ChevronsLeft } from "lucide-react"

interface TShirtSwipeProps {
  onCollect: () => void
  collected: boolean
}

export default function TShirtSwipe({ onCollect, collected }: TShirtSwipeProps) {
  const [progress, setProgress] = useState(0) // 0-1 (swipe left)
  const startX = useRef<number | null>(null)
  const dragging = useRef(false)
  const THRESHOLD = 0.75

  const begin = useCallback((clientX: number) => {
    if (collected) return
    startX.current = clientX
    dragging.current = true
  }, [collected])

  const move = useCallback((clientX: number) => {
    if (!dragging.current || startX.current === null) return
    const delta = startX.current - clientX
    const maxDrag = 200
    const p = Math.min(1, Math.max(0, delta / maxDrag))
    setProgress(p)
    if (p >= THRESHOLD) {
      dragging.current = false
      setProgress(1)
      onCollect()
    }
  }, [onCollect])

  const end = useCallback(() => {
    if (!collected) setProgress(0)
    dragging.current = false
  }, [collected])

  const onTouchStart = (e: React.TouchEvent) => begin(e.touches[0].clientX)
  const onTouchMove = (e: React.TouchEvent) => move(e.touches[0].clientX)

  const onMouseDown = (e: React.MouseEvent) => {
    begin(e.clientX)
    const onMouseMove = (ev: MouseEvent) => move(ev.clientX)
    const onMouseUp = () => {
      end()
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  const shirtX = Math.round(progress * -280)

  return (
    <div
      className="flex flex-col items-center gap-6 select-none touch-none"
      aria-label="Tシャツを左にスワイプして取り込む"
    >
      {/* Clothesline */}
      <div className="relative w-72 h-48 overflow-hidden">
        {/* Line */}
        <div
          className="absolute top-10 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-700/60 to-transparent rounded-full"
          aria-hidden
        />
        {/* Clips */}
        {!collected && (
          <>
            <div className="absolute top-7 left-[calc(50%-20px)] w-2 h-5 bg-amber-700/60 rounded-sm" aria-hidden />
            <div className="absolute top-7 left-[calc(50%+18px)] w-2 h-5 bg-amber-700/60 rounded-sm" aria-hidden />
          </>
        )}

        {/* T-Shirt SVG */}
        {!collected && (
          <div
            className="absolute top-10 cursor-grab active:cursor-grabbing"
            style={{
              left: "calc(50% - 40px)",
              transform: `translateX(${shirtX}px) rotate(${progress * -15}deg)`,
              transition: dragging.current ? "none" : "transform 0.3s",
              touchAction: "none",
            }}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={end}
          >
            <TShirtSVG />
          </div>
        )}

        {/* Collected state */}
        {collected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
              </svg>
            </div>
            <span className="text-primary font-bold text-sm">取り込み完了！</span>
          </div>
        )}
      </div>

      {!collected && (
        <div className="flex items-center gap-3">
          <div
            className="swipe-glow flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-3 shadow-lg cursor-grab active:cursor-grabbing font-bold"
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={end}
          >
            <ChevronsLeft size={20} />
            <span>左にスワイプして取り込む</span>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {!collected && (
        <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${progress * 100}%` }}
            aria-hidden
          />
        </div>
      )}
    </div>
  )
}

function TShirtSVG() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 100 100"
      className="shirt-float drop-shadow-lg"
      aria-label="Tシャツ"
    >
      {/* Body */}
      <path
        d="M30 40 L10 30 L20 15 L35 25 Q50 30 65 25 L80 15 L90 30 L70 40 L70 85 L30 85 Z"
        fill="#60a5fa"
        stroke="#3b82f6"
        strokeWidth="1.5"
      />
      {/* Collar */}
      <path
        d="M35 25 Q50 35 65 25"
        fill="none"
        stroke="#93c5fd"
        strokeWidth="2"
      />
      {/* Sleeve shadow */}
      <path
        d="M10 30 L20 15 L22 17 L12 31 Z"
        fill="#3b82f6"
        opacity="0.4"
      />
      <path
        d="M90 30 L80 15 L78 17 L88 31 Z"
        fill="#3b82f6"
        opacity="0.4"
      />
    </svg>
  )
}
