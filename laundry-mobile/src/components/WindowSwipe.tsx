import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme'

interface WindowSwipeProps {
  disabled: boolean
  onOpen: () => void
}

const THRESHOLD = 0.85
const MAX_DRAG = 220
const WINDOW_W = 192
const WINDOW_H = 144

export default function WindowSwipe({ disabled, onOpen }: WindowSwipeProps) {
  const [opened, setOpened] = useState(false)
  const progress = useRef(new Animated.Value(0)).current

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled && !opened,
      onMoveShouldSetPanResponder: () => !disabled && !opened,
      onPanResponderMove: (_, gestureState) => {
        const delta = -gestureState.dy // upward = positive
        const p = Math.min(1, Math.max(0, delta / MAX_DRAG))
        progress.setValue(p)
        if (p >= THRESHOLD) {
          setOpened(true)
          Animated.spring(progress, {
            toValue: 1,
            useNativeDriver: false,
          }).start()
          onOpen()
        }
      },
      onPanResponderRelease: () => {
        if (!opened) {
          Animated.spring(progress, {
            toValue: 0,
            useNativeDriver: false,
          }).start()
        }
      },
    })
  ).current

  const blindHeight = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['100%', '0%'],
  })

  const handleTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -MAX_DRAG],
  })

  if (disabled) {
    return (
      <View style={[styles.wrapper, { opacity: 0.4 }]}>
        <View style={styles.windowFrame}>
          <View style={[styles.blind, { height: '100%' }]} />
        </View>
        <Text style={styles.disabledText}>雨1時間前に解放されます</Text>
      </View>
    )
  }

  return (
    <View style={styles.wrapper}>
      {/* Window frame */}
      <View
        style={[
          styles.windowFrame,
          opened && styles.windowFrameOpened,
        ]}
        {...panResponder.panHandlers}
      >
        {/* Sky background */}
        <LinearGradient
          colors={['#93c5fd', '#3b82f6']}
          style={StyleSheet.absoluteFill}
        />

        {/* Blind */}
        {!opened && (
          <Animated.View
            style={[
              styles.blind,
              { height: blindHeight },
            ]}
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={styles.blindSlat} />
            ))}
          </Animated.View>
        )}

        {/* Opened state emoji */}
        {opened && (
          <View style={styles.sunContainer}>
            <Text style={styles.sunEmoji}>🌤</Text>
          </View>
        )}
      </View>

      {/* Swipe handle */}
      {!opened && (
        <Animated.View
          style={[
            styles.handleContainer,
            { transform: [{ translateY: handleTranslateY }] },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handleCircle}>
            <Ionicons name="chevron-up" size={28} color={COLORS.white} />
          </View>
          <Text style={styles.handleText}>上にスワイプ</Text>
        </Animated.View>
      )}

      {/* Opened label */}
      {opened && (
        <Text style={styles.openedText}>窓オープン！</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 12,
  },
  windowFrame: {
    width: WINDOW_W,
    height: WINDOW_H,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
  },
  windowFrameOpened: {
    borderColor: 'rgba(250,204,21,0.8)',
    shadowColor: '#facc15',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  blind: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#cbd5e1',
    justifyContent: 'space-evenly',
  },
  blindSlat: {
    height: 1,
    backgroundColor: 'rgba(100,116,139,0.4)',
    marginTop: 12,
  },
  sunContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunEmoji: {
    fontSize: 40,
  },
  handleContainer: {
    alignItems: 'center',
    gap: 8,
  },
  handleCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  handleText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FONT_SIZE.xs,
    fontWeight: '500',
  },
  disabledText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  openedText: {
    color: '#fde047',
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
  },
})
