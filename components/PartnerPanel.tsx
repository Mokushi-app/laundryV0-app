"use client"

import { Bell, CheckCircle, XCircle, Clock } from "lucide-react"

interface Partner {
  name: string
  avatar: string
  score: number | null
  collected: boolean
}

interface PartnerPanelProps {
  partner: Partner
  myCollected: boolean
}

export default function PartnerPanel({ partner, myCollected }: PartnerPanelProps) {
  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-4">
      <div className="flex items-center gap-3 mb-3">
        <Bell size={16} className="text-primary" />
        <span className="text-white/80 text-sm font-semibold">パートナー</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center text-xl font-bold text-white border-2 border-primary/50">
            {partner.avatar}
          </div>
          {/* Status dot */}
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white/20 ${
              partner.collected ? "bg-green-400" : "bg-slate-500"
            }`}
            aria-hidden
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="text-white font-bold text-sm">{partner.name}</p>
          {partner.collected ? (
            <div className="flex items-center gap-1 text-green-400 text-xs">
              <CheckCircle size={12} />
              <span>取り込み済み（{partner.score?.toLocaleString()} pts）</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-white/40 text-xs">
              <Clock size={12} />
              <span>まだ取り込んでいない</span>
            </div>
          )}
        </div>

        {/* Laundry status icon */}
        {myCollected ? (
          <div className="flex flex-col items-center gap-0.5">
            <XCircle size={24} className="text-red-400" />
            <span className="text-red-400/80 text-[10px] leading-none">消滅</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-0.5">
            <svg width="24" height="24" viewBox="0 0 100 100" aria-label="Tシャツ" className="opacity-60">
              <path
                d="M30 40 L10 30 L20 15 L35 25 Q50 30 65 25 L80 15 L90 30 L70 40 L70 85 L30 85 Z"
                fill="#60a5fa"
              />
            </svg>
            <span className="text-blue-300/80 text-[10px] leading-none">干し中</span>
          </div>
        )}
      </div>

      {/* Notification sent indicator */}
      {myCollected && (
        <div className="mt-3 flex items-center gap-2 text-xs text-yellow-300/80 bg-yellow-400/10 rounded-xl px-3 py-2">
          <Bell size={12} />
          <span>{partner.name}に通知を送りました</span>
        </div>
      )}
    </div>
  )
}
