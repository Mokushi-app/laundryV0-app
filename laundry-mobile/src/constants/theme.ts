// ─── Design Tokens ───────────────────────────────────────────────────────────

export const COLORS = {
  // Brand
  primary: '#60a5fa',
  primaryDark: '#3b82f6',

  // Phase gradients (start, end)
  safe: ['#2563eb', '#1e3a5f'],
  warning: ['#1e40af', '#1a1a3e'],
  window: ['#4338ca', '#1e1b4b'],
  rained: ['#374151', '#1f2937'],

  // Rank colors
  rankS: '#facc15',
  rankA: '#4ade80',
  rankB: '#60a5fa',
  rankC: '#94a3b8',
  rankF: '#f87171',

  // Neutral
  white: '#ffffff',
  black: '#000000',
  surface: 'rgba(255,255,255,0.1)',
  surfaceBorder: 'rgba(255,255,255,0.2)',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.7)',
  textMuted: 'rgba(255,255,255,0.4)',
} as const

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  hero: 56,
} as const

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const
