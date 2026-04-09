import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { HistoryEntry, Rank } from '../constants/game'
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme'

interface ScoreHistoryProps {
  entries: HistoryEntry[]
  totalScore: number
  streak: number
}

const RANK_COLOR: Record<Rank, string> = {
  S: COLORS.rankS,
  A: COLORS.rankA,
  B: COLORS.rankB,
  C: COLORS.rankC,
  F: COLORS.rankF,
}

export default function ScoreHistory({ entries, totalScore, streak }: ScoreHistoryProps) {
  const maxScore = Math.max(...entries.map((e) => e.score), 1)

  return (
    <View style={styles.wrapper}>
      {/* Summary cards */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>累計スコア</Text>
          <Text style={styles.summaryValue}>{totalScore.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>連続取り込み</Text>
          <Text style={styles.summaryValue}>
            {streak}<Text style={styles.summaryUnit}>日</Text>
          </Text>
        </View>
      </View>

      {/* History list */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderText}>履歴</Text>
        </View>
        {entries.map((entry, i) => (
          <View
            key={i}
            style={[
              styles.listItem,
              i < entries.length - 1 && styles.listItemBorder,
            ]}
          >
            {/* Rank dot */}
            <View style={[styles.rankDot, { backgroundColor: RANK_COLOR[entry.rank] }]} />

            {/* Date */}
            <Text style={styles.dateText}>{entry.date}</Text>

            {/* Mini bar */}
            <View style={styles.miniBarTrack}>
              <View
                style={[
                  styles.miniBarFill,
                  {
                    width: `${(entry.score / maxScore) * 100}%`,
                    backgroundColor: RANK_COLOR[entry.rank],
                  },
                ]}
              />
            </View>

            {/* Score */}
            <Text style={[styles.scoreText, { color: RANK_COLOR[entry.rank] }]}>
              {entry.score.toLocaleString()}
            </Text>

            {/* Minutes */}
            <Text style={styles.minutesText}>{entry.minutesBefore}分前</Text>

            {/* Rank */}
            <Text style={[styles.rankText, { color: RANK_COLOR[entry.rank] }]}>
              {entry.rank}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    gap: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: SPACING.md,
    gap: 4,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: FONT_SIZE.xs,
  },
  summaryValue: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  summaryUnit: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
  },
  listContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    overflow: 'hidden',
  },
  listHeader: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  listHeaderText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  listItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  rankDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dateText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: FONT_SIZE.xs,
    width: 40,
  },
  miniBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  miniBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  scoreText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    width: 52,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  minutesText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: FONT_SIZE.xs,
    width: 40,
    textAlign: 'right',
  },
  rankText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '900',
    width: 16,
    textAlign: 'center',
  },
})
