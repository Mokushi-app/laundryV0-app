import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
} from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme'

interface TShirtSwipeProps {
  onCollect: () => void
  collected: boolean
}

const THRESHOLD = 0.75
const MAX_DRAG = 200

export default function TShirtSwipe({ onCollect, collected }: TShirtSwipeProps) {
  const [done, setDone] = useState(false)
  const progress = useRef(new Animated.Value(0)).current

  // Use a ref to store latest state to avoid stale closures in PanResponder
  const stateRef = useRef({ collected, done, onCollect })
  stateRef.current = { collected, done, onCollect }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !stateRef.current.collected && !stateRef.current.done,
      onStartShouldSetPanResponderCapture: () => !stateRef.current.collected && !stateRef.current.done,
      onMoveShouldSetPanResponder: (_, gs) => !stateRef.current.collected && !stateRef.current.done && gs.dx < -5,
      onMoveShouldSetPanResponderCapture: (_, gs) => !stateRef.current.collected && !stateRef.current.done && gs.dx < -5,
      onPanResponderGrant: () => {
        // Scroll lock no longer needed as ScrollView is removed
      },
      onPanResponderMove: (_, gestureState) => {
        const delta = -gestureState.dx // left = positive
        const p = Math.min(1, Math.max(0, delta / MAX_DRAG))
        progress.setValue(p)
        if (p >= THRESHOLD) {
          setDone(true)
          Animated.spring(progress, {
            toValue: 1,
            useNativeDriver: false,
          }).start()
          stateRef.current.onCollect()
        }
      },
      onPanResponderRelease: () => {
        if (!stateRef.current.done) {
          Animated.spring(progress, {
            toValue: 0,
            useNativeDriver: false,
          }).start()
        }
      },
      onPanResponderTerminate: () => {
        if (!stateRef.current.done) {
          Animated.spring(progress, {
            toValue: 0,
            useNativeDriver: false,
          }).start()
        }
      },
    })
  ).current

  const shirtTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -280],
  })

  const shirtRotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-15deg'],
  })

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  })

  const showCollected = collected || done

  return (
    <View style={styles.wrapper}>
      {/* Clothesline area */}
      <View style={styles.lineArea}>
        {/* Line */}
        <View style={styles.clothesline} />

        {/* Clips */}
        {!showCollected && (
          <>
            <View style={[styles.clip, { left: '43%' }]} />
            <View style={[styles.clip, { left: '55%' }]} />
          </>
        )}

        {/* T-Shirt */}
        {!showCollected && (
          <Animated.View
            style={[
              styles.shirt,
              {
                transform: [
                  { translateX: shirtTranslateX },
                  { rotate: shirtRotate },
                ],
              },
            ]}
            {...panResponder.panHandlers}
          >
            <TShirtSVG />
          </Animated.View>
        )}

        {/* Collected state */}
        {showCollected && (
          <View style={styles.collectedContainer}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.collectedText}>取り込み完了！</Text>
          </View>
        )}
      </View>

      {/* Swipe button */}
      {!showCollected && (
        <View
          style={styles.swipeButton}
          {...panResponder.panHandlers}
        >
          <Ionicons name="chevron-back" size={20} color={COLORS.white} />
          <Text style={styles.swipeButtonText}>左にスワイプして取り込む</Text>
        </View>
      )}

      {/* Progress bar */}
      {!showCollected && (
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressBar, { width: barWidth }]}
          />
        </View>
      )}
    </View>
  )
}

function TShirtSVG() {
  return (
    <Svg width={80} height={80} viewBox="0 0 100 100">
      <Path
        d="M30 40 L10 30 L20 15 L35 25 Q50 30 65 25 L80 15 L90 30 L70 40 L70 85 L30 85 Z"
        fill="#60a5fa"
        stroke="#3b82f6"
        strokeWidth={1.5}
      />
      <Path
        d="M35 25 Q50 35 65 25"
        fill="none"
        stroke="#93c5fd"
        strokeWidth={2}
      />
      <Path
        d="M10 30 L20 15 L22 17 L12 31 Z"
        fill="#3b82f6"
        opacity={0.4}
      />
      <Path
        d="M90 30 L80 15 L78 17 L88 31 Z"
        fill="#3b82f6"
        opacity={0.4}
      />
    </Svg>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: SPACING.lg,
  },
  lineArea: {
    width: 288,
    height: 192,
    overflow: 'hidden',
  },
  clothesline: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(180,120,60,0.6)',
    borderRadius: 2,
  },
  clip: {
    position: 'absolute',
    top: 28,
    width: 8,
    height: 20,
    backgroundColor: 'rgba(180,120,60,0.6)',
    borderRadius: 2,
  },
  shirt: {
    position: 'absolute',
    top: 40,
    left: '35%',
  },
  collectedContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(96,165,250,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectedText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  swipeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  swipeButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONT_SIZE.md,
  },
  progressTrack: {
    width: 192,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
})
