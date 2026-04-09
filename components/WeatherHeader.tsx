"use client"

import { CloudRain, MapPin, Wind, Droplets } from "lucide-react"

interface WeatherHeaderProps {
  location: string
  temperature: number
  humidity: number
  windSpeed: number
  rainTime: Date | null
  remainingMinutes: number
  phase: "safe" | "warning" | "window" | "rained"
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })
}

export default function WeatherHeader({
  location,
  temperature,
  humidity,
  windSpeed,
  rainTime,
  remainingMinutes,
  phase,
}: WeatherHeaderProps) {
  // Use the server-safe remainingMinutes prop directly — no Date.now() call
  const mins = Math.max(0, remainingMinutes)

  const skyClasses: Record<typeof phase, string> = {
    safe: "from-[oklch(0.70_0.14_220)] to-[oklch(0.55_0.18_235)]",
    warning: "from-[oklch(0.62_0.13_225)] to-[oklch(0.45_0.18_255)]",
    window: "from-[oklch(0.50_0.16_250)] to-[oklch(0.35_0.22_270)]",
    rained: "from-[oklch(0.35_0.08_240)] to-[oklch(0.25_0.08_250)]",
  }

  return (
    <div
      className={`relative bg-gradient-to-b ${skyClasses[phase]} overflow-hidden rounded-b-3xl pb-6`}
      role="banner"
      aria-label="天気情報"
    >
      {/* Cloud SVG decorations */}
      <div className="absolute top-4 left-4 opacity-30">
        <svg width="80" height="40" viewBox="0 0 80 40" fill="white" aria-hidden>
          <ellipse cx="40" cy="30" rx="35" ry="14" />
          <ellipse cx="25" cy="24" rx="18" ry="14" />
          <ellipse cx="55" cy="22" rx="20" ry="16" />
        </svg>
      </div>
      <div className="absolute top-8 right-8 opacity-20 scale-75">
        <svg width="80" height="40" viewBox="0 0 80 40" fill="white" aria-hidden>
          <ellipse cx="40" cy="30" rx="35" ry="14" />
          <ellipse cx="25" cy="24" rx="18" ry="14" />
          <ellipse cx="55" cy="22" rx="20" ry="16" />
        </svg>
      </div>

      {/* Rain drops (animated only in window/rained phase) */}
      {(phase === "window" || phase === "rained") && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rain-drop absolute w-0.5 rounded-full bg-white/40"
              style={{
                left: `${8 + i * 8}%`,
                top: `${-20 - (i % 4) * 10}%`,
                height: `${16 + (i % 3) * 8}px`,
                animationDuration: `${0.8 + (i % 5) * 0.2}s`,
                animationDelay: `${(i % 6) * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative pt-10 px-6">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-white/80 text-sm mb-2">
          <MapPin size={14} />
          <span>{location}</span>
        </div>

        {/* Temperature */}
        <div className="flex items-end gap-2 mb-4">
          <span className="text-7xl font-black text-white leading-none">{temperature}</span>
          <span className="text-3xl text-white/80 mb-2">°C</span>
        </div>

        {/* Stats row */}
        <div className="flex gap-4 text-white/70 text-sm mb-4">
          <span className="flex items-center gap-1">
            <Droplets size={14} />
            {humidity}%
          </span>
          <span className="flex items-center gap-1">
            <Wind size={14} />
            {windSpeed}m/s
          </span>
        </div>

        {/* Rain badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
          <CloudRain size={16} className="text-white" />
          <span className="text-white font-medium text-sm">
            {phase === "rained"
              ? "雨が降りました"
              : rainTime
              ? `雨の予報 ${formatTime(rainTime)} （あと${mins}分）`
              : `雨まであと${mins}分`}
          </span>
        </div>
      </div>
    </div>
  )
}
