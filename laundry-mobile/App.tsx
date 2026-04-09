import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import Svg, { Path } from 'react-native-svg'

import WeatherHeader from './src/components/WeatherHeader'
import CountdownRing from './src/components/CountdownRing'
import WindowSwipe from './src/components/WindowSwipe'
import TShirtSwipe from './src/components/TShirtSwipe'
import ScoreDisplay from './src/components/ScoreDisplay'
import PartnerPanel from './src/components/PartnerPanel'
import ScoreHistory from './src/components/ScoreHistory'

import {
  Phase,
  TOTAL_MINUTES,
  WINDOW_MINUTES,
  HISTORY,
  DEFAULT_PARTNER,
  calcScore,
  getPhase,
} from './src/constants/game'
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from './src/constants/theme'

// ─── Phase Gradient Colors ───────────────────────────────────────────────────

const BG_GRADIENT: Record<Phase, [string, string, string]> = {
  safe: ['#1e40af', '#1e3a5f', '#151c30'],
  warning: ['#1e3a8a', '#1a1a4e', '#101030'],
  window: ['#4338ca', '#2e1065', '#1a0f30'],
  rained: ['#374151', '#1f2937', '#111827'],
}

// ─── App State ───────────────────────────────────────────────────────────────

interface AppState {
  windowOpen: boolean
  collected: boolean
  phase: Phase
  remainingMinutes: number
  score: number
  rank: 'S' | 'A' | 'B' | 'C' | 'F'
  collectMinutesBefore: number
  showHistory: boolean
  partnerCollected: boolean
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function SentakuApp() {
  const [state, setState] = useState<AppState>({
    windowOpen: false,
    collected: false,
    phase: 'safe',
    remainingMinutes: TOTAL_MINUTES,
    score: 0,
    rank: 'C',
    collectMinutesBefore: 0,
    showHistory: false,
    partnerCollected: false,
  })

  // Simulate countdown (1 real second = 1 demo minute)
  useEffect(() => {
    if (state.collected || state.phase === 'rained') return
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
      return {
        ...prev,
        collected: true,
        score,
        rank,
        collectMinutesBefore: minutesBefore,
        partnerCollected: false,
      }
    })
  }, [])

  const handleReset = useCallback(() => {
    setState({
      windowOpen: false,
      collected: false,
      phase: 'safe',
      remainingMinutes: TOTAL_MINUTES,
      score: 0,
      rank: 'C',
      collectMinutesBefore: 0,
      showHistory: false,
      partnerCollected: false,
    })
  }, [])

  const windowUnlocked = state.phase === 'window' || state.phase === 'rained'
  const totalScore =
    HISTORY.reduce((s, e) => s + e.score, 0) + (state.collected ? state.score : 0)
  const streak = 5

  return (
    <SafeAreaProvider>
    <LinearGradient colors={BG_GRADIENT[state.phase]} style={styles.root}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.title}>センタク</Text>
          <TouchableOpacity
            onPress={() => setState((s) => ({ ...s, showHistory: !s.showHistory }))}
            style={styles.historyButton}
          >
            <Ionicons
              name={state.showHistory ? 'close' : 'time-outline'}
              size={18}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>

        {/* ── Weather Info ── */}
        <WeatherHeader
          location="東京・渋谷区"
          temperature={18}
          humidity={72}
          windSpeed={3.2}
          remainingMinutes={state.remainingMinutes}
          phase={state.phase}
        />

        {/* ── Main content body (Non-scrollable) ── */}
        <View style={styles.contentContainer}>
          {state.showHistory ? (
            <ScoreHistory entries={HISTORY} totalScore={totalScore} streak={streak} />
          ) : (
            <>
              {/* Countdown */}
              {!state.collected && (
                <View style={styles.centered}>
                  <CountdownRing
                    totalMinutes={TOTAL_MINUTES}
                    remainingMinutes={state.remainingMinutes}
                    windowMinutes={WINDOW_MINUTES}
                    phase={state.phase}
                  />
                </View>
              )}

              {/* Window unlock banner */}
              {windowUnlocked && !state.collected && (
                <View style={styles.banner}>
                  <Text style={styles.bannerText}>
                    {state.phase === 'rained'
                      ? '雨が降っています — 今日はアウト'
                      : '今だ！窓を開けて取り込もう'}
                  </Text>
                </View>
              )}

              {/* Phase 1: Window swipe */}
              {!state.windowOpen && !state.collected && (
                <View style={styles.centered}>
                  <Text style={styles.hintText}>
                    {windowUnlocked
                      ? '窓を開けてください'
                      : `あと${state.remainingMinutes - WINDOW_MINUTES}分で窓が解放されます`}
                  </Text>
                  <WindowSwipe 
                    disabled={!windowUnlocked} 
                    onOpen={handleWindowOpen} 
                  />
                </View>
              )}

              {/* Phase 2: Laundry swipe */}
              {state.windowOpen && !state.collected && (
                <View style={styles.centered}>
                  <Text style={styles.hintText}>洗濯物を取り込んでください</Text>
                  <TShirtSwipe 
                    onCollect={handleCollect} 
                    collected={false} 
                  />
                </View>
              )}

              {/* Result */}
              {state.collected && (
                <View style={styles.resultContainer}>
                  <ScoreDisplay
                    score={state.score}
                    maxScore={9999}
                    rank={state.rank}
                    label={`雨の${state.collectMinutesBefore}分前に取り込んだ！`}
                  />

                  <PartnerPanel
                    partner={{ ...DEFAULT_PARTNER, collected: state.partnerCollected }}
                    myCollected={state.collected}
                  />

                  <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                    <Text style={styles.resetButtonText}>もう一度プレイ（デモリセット）</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Partner panel (while playing) */}
              {state.windowOpen && !state.collected && (
                <PartnerPanel
                  partner={{ ...DEFAULT_PARTNER, collected: false }}
                  myCollected={false}
                />
              )}
            </>
          )}
        </View>

        {/* ── Bottom Nav ── */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            onPress={() => setState((s) => ({ ...s, showHistory: false }))}
            style={styles.navItem}
          >
            <Svg width={22} height={22} viewBox="0 0 100 100">
              <Path
                d="M30 40 L10 30 L20 15 L35 25 Q50 30 65 25 L80 15 L90 30 L70 40 L70 85 L30 85 Z"
                fill={!state.showHistory ? COLORS.primary : 'rgba(255,255,255,0.4)'}
              />
            </Svg>
            <Text
              style={[
                styles.navLabel,
                !state.showHistory && styles.navLabelActive,
              ]}
            >
              今日
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setState((s) => ({ ...s, showHistory: true }))}
            style={styles.navItem}
          >
            <Ionicons
              name="time-outline"
              size={22}
              color={state.showHistory ? COLORS.primary : 'rgba(255,255,255,0.4)'}
            />
            <Text
              style={[
                styles.navLabel,
                state.showHistory && styles.navLabelActive,
              ]}
            >
              履歴
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
    </SafeAreaProvider>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  title: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  historyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
    justifyContent: 'center',
  },
  centered: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  banner: {
    backgroundColor: 'rgba(250,204,21,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(250,204,21,0.4)',
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  bannerText: {
    color: '#fde047',
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
  },
  hintText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  resultContainer: {
    gap: SPACING.lg,
  },
  resetButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: 14,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    fontSize: FONT_SIZE.sm,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: FONT_SIZE.xs,
    fontWeight: '500',
  },
  navLabelActive: {
    color: COLORS.primary,
  },
})
