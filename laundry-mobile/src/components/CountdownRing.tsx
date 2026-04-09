import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg'
import { Phase } from '../constants/game'
import { COLORS, FONT_SIZE } from '../constants/theme'

interface CountdownRingProps {
  totalMinutes: number
  remainingMinutes: number
  windowMinutes: number
  phase: Phase
}

const SIZE = 180
const STROKE = 12
const R = (SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * R

const PHASE_COLORS: Record<Phase, [string, string]> = {
  safe: ['#60a5fa', '#818cf8'],
  warning: ['#60a5fa', '#818cf8'],
  window: ['#facc15', '#f97316'],
  rained: ['#6b7280', '#374151'],
}

const PHASE_LABEL: Record<Phase, { text: string; color: string }> = {
  safe: { text: '安全', color: '#bfdbfe' },
  warning: { text: '準備して', color: '#fde047' },
  window: { text: '今すぐ！', color: '#facc15' },
  rained: { text: '雨中', color: '#9ca3af' },
}

export default function CountdownRing({
  totalMinutes,
  remainingMinutes,
  windowMinutes,
  phase,
}: CountdownRingProps) {
  const progress = Math.max(0, remainingMinutes / totalMinutes)
  const strokeDashoffset = CIRC * (1 - progress)

  // Window zone
  const windowFraction = windowMinutes / totalMinutes
  const windowDashArray = `${CIRC * windowFraction} ${CIRC * (1 - windowFraction)}`
  const windowOffset = CIRC * (1 - windowFraction)

  const hrs = Math.floor(remainingMinutes / 60)
  const mins = remainingMinutes % 60
  const label = PHASE_LABEL[phase]
  const [color1, color2] = PHASE_COLORS[phase]

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>
        <Defs>
          <SvgGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={color1} />
            <Stop offset="1" stopColor={color2} />
          </SvgGradient>
        </Defs>

        {/* Track */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={STROKE}
          fill="none"
        />

        {/* Window zone highlight */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          stroke="rgba(255,210,60,0.35)"
          strokeWidth={STROKE + 4}
          fill="none"
          strokeDasharray={windowDashArray}
          strokeDashoffset={windowOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />

        {/* Progress arc */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          stroke="url(#progressGrad)"
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${CIRC}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>

      {/* Center text */}
      <View style={styles.centerText}>
        <Text style={[styles.phaseText, { color: label.color }]}>{label.text}</Text>
        {phase !== 'rained' ? (
          <Text style={styles.timeText}>
            {hrs > 0 ? `${hrs}:${String(mins).padStart(2, '0')}` : `${mins}分`}
          </Text>
        ) : (
          <Text style={[styles.timeText, { color: '#d1d5db' }]}>---</Text>
        )}
        <Text style={styles.subText}>雨まで</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
    gap: 2,
  },
  phaseText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  timeText: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white,
    fontVariant: ['tabular-nums'],
  },
  subText: {
    fontSize: FONT_SIZE.xs,
    color: 'rgba(255,255,255,0.5)',
  },
})
