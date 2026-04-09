import React from 'react'
import { View, Text, StyleSheet
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { Phase } from '../constants/game'
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme'

interface WeatherHeaderProps {
  location: string
  temperature: number
  humidity: number
  windSpeed: number
  remainingMinutes: number
  phase: Phase
}

const PHASE_GRADIENT: Record<Phase, [string, string]> = {
  safe: ['#3b82f6', '#1d4ed8'],
  warning: ['#2563eb', '#1e3a8a'],
  window: ['#6366f1', '#312e81'],
  rained: ['#4b5563', '#1f2937'],
}

export default function WeatherHeader({
  location,
  temperature,
  humidity,
  windSpeed,
  remainingMinutes,
  phase,
}: WeatherHeaderProps) {
  const mins = Math.max(0, remainingMinutes)
  const hrs = Math.floor(mins / 60)
  const m = mins % 60

  const rainTimeLabel =
    phase === 'rained'
      ? '雨が降りました'
      : `雨まであと${hrs > 0 ? `${hrs}時間` : ''}${m}分`

  return (
    <LinearGradient
      colors={PHASE_GRADIENT[phase]}
      style={styles.container}
    >
      {/* Location */}
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
        <Text style={styles.locationText}>{location}</Text>
      </View>

      {/* Temperature */}
      <View style={styles.tempRow}>
        <Text style={styles.tempValue}>{temperature}</Text>
        <Text style={styles.tempUnit}>°C</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="water-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.statText}>{humidity}%</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="flag-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.statText}>{windSpeed}m/s</Text>
        </View>
      </View>

      {/* Rain badge */}
      <View style={styles.rainBadge}>
        <Ionicons name="rainy-outline" size={16} color={COLORS.white} />
        <Text style={styles.rainText}>{rainTimeLabel}</Text>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.sm,
  },
  locationText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginBottom: SPACING.md,
  },
  tempValue: {
    fontSize: FONT_SIZE.hero,
    fontWeight: '900',
    color: COLORS.white,
    lineHeight: FONT_SIZE.hero,
  },
  tempUnit: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  rainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignSelf: 'flex-start',
  },
  rainText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
})
