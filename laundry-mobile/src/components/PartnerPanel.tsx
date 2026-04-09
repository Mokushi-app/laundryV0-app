import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Svg, { Path } from 'react-native-svg'
import { Partner } from '../constants/game'
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme'

interface PartnerPanelProps {
  partner: Partner
  myCollected: boolean
}

export default function PartnerPanel({ partner, myCollected }: PartnerPanelProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="notifications-outline" size={16} color={COLORS.primary} />
        <Text style={styles.headerText}>パートナー</Text>
      </View>

      <View style={styles.row}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{partner.avatar}</Text>
          </View>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: partner.collected ? '#4ade80' : '#64748b' },
            ]}
          />
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.nameText}>{partner.name}</Text>
          {partner.collected ? (
            <View style={styles.statusRow}>
              <Ionicons name="checkmark-circle" size={12} color="#4ade80" />
              <Text style={styles.statusTextGreen}>
                取り込み済み（{partner.score?.toLocaleString()} pts）
              </Text>
            </View>
          ) : (
            <View style={styles.statusRow}>
              <Ionicons name="time-outline" size={12} color={COLORS.textMuted} />
              <Text style={styles.statusTextMuted}>まだ取り込んでいない</Text>
            </View>
          )}
        </View>

        {/* Laundry status */}
        <View style={styles.laundryStatus}>
          {myCollected ? (
            <>
              <Ionicons name="close-circle" size={24} color="#f87171" />
              <Text style={styles.laundryLabelRed}>消滅</Text>
            </>
          ) : (
            <>
              <Svg width={24} height={24} viewBox="0 0 100 100">
                <Path
                  d="M30 40 L10 30 L20 15 L35 25 Q50 30 65 25 L80 15 L90 30 L70 40 L70 85 L30 85 Z"
                  fill="#60a5fa"
                  opacity={0.6}
                />
              </Svg>
              <Text style={styles.laundryLabelBlue}>干し中</Text>
            </>
          )}
        </View>
      </View>

      {/* Notification sent */}
      {myCollected && (
        <View style={styles.notificationBar}>
          <Ionicons name="notifications" size={12} color="rgba(253,224,71,0.8)" />
          <Text style={styles.notificationText}>{partner.name}に通知を送りました</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  headerText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(96,165,250,0.3)',
    borderWidth: 2,
    borderColor: 'rgba(96,165,250,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  statusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  info: {
    flex: 1,
  },
  nameText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  statusTextGreen: {
    color: '#4ade80',
    fontSize: FONT_SIZE.xs,
  },
  statusTextMuted: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
  },
  laundryStatus: {
    alignItems: 'center',
    gap: 2,
  },
  laundryLabelRed: {
    color: 'rgba(248,113,113,0.8)',
    fontSize: FONT_SIZE.xs,
    lineHeight: 12,
  },
  laundryLabelBlue: {
    color: 'rgba(147,197,253,0.8)',
    fontSize: FONT_SIZE.xs,
    lineHeight: 12,
  },
  notificationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(250,204,21,0.1)',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.md,
  },
  notificationText: {
    color: 'rgba(253,224,71,0.8)',
    fontSize: FONT_SIZE.xs,
  },
})
