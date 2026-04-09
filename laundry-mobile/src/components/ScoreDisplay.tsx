import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Rank } from '../constants/game'
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme'

interface ScoreDisplayProps {
  score: number
  maxScore: number
  rank: Rank
  label: string
}

const RANK_CONFIG: Record<Rank, { color: string; bg: string; borderColor: string; gradient: [string, string] }> = {
  S: { color: COLORS.rankS, bg: 'rgba(250,204,21,0.2)', borderColor: 'rgba(250,204,21,0.5)', gradient: ['#facc15', '#f97316'] },
  A: { color: COLORS.rankA, bg: 'rgba(74,222,128,0.2)', borderColor: 'rgba(74,222,128,0.5)', gradient: ['#4ade80', '#14b8a6'] },
  B: { color: COLORS.rankB, bg: 'rgba(96,165,250,0.2)', borderColor: 'rgba(96,165,250,0.5)', gradient: ['#60a5fa', '#818cf8'] },
  C: { color: COLORS.rankC, bg: 'rgba(148,163,184,0.2)', borderColor: 'rgba(148,163,184,0.5)', gradient: ['#94a3b8', '#64748b'] },
  F: { color: COLORS.rankF, bg: 'rgba(248,113,113,0.2)', borderColor: 'rgba(248,113,113,0.5)', gradient: ['#f87171', '#ef4444'] },
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
    <View style={styles.wrapper}>
      {/* Rank badge */}
      <View style={[styles.rankBadge, { backgroundColor: cfg.bg, borderColor: cfg.borderColor }]}>
        <Text style={[styles.rankText, { color: cfg.color }]}>{rank}</Text>
      </View>

      {/* Score */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreValue}>{displayed.toLocaleString()}</Text>
        <Text style={styles.scoreLabel}>{label}</Text>
      </View>

      {/* Score bar */}
      <View style={styles.barTrack}>
        <LinearGradient
          colors={cfg.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.barFill, { width: `${pct}%` }]}
        />
      </View>

      <Text style={styles.maxText}>最高 {maxScore.toLocaleString()} pts</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  rankBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  rankText: {
    fontSize: 36,
    fontWeight: '900',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.white,
    fontVariant: ['tabular-nums'],
  },
  scoreLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: FONT_SIZE.sm,
    marginTop: 4,
  },
  barTrack: {
    width: 256,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  maxText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: FONT_SIZE.xs,
  },
})
