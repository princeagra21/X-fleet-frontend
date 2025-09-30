import type { ThemeColors, FontConfig } from '@/types'

// App Configuration
export const APP_CONFIG = {
  name: 'X-Fleet',
  description: 'Professional Fleet Management System',
  version: '1.0.0',
  author: 'X-Fleet Team',
} as const

// Theme Configuration
export const THEME_COLORS: ThemeColors = {
  primaryColor: 'oklch(0.646 0.222 41.116)',
  secondaryColor: 'oklch(0.6 0.118 184.704)',
} as const

// Font Configuration
export const FONT_CONFIG: FontConfig = {
  primaryFont: 'Inter',
  secondaryFont: 'Satoshi Bold',
  numberFont: 'IBM Plex Mono',
} as const

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'x-fleet-access-token',
  REFRESH_TOKEN: 'x-fleet-refresh-token',
  USER_PREFERENCES: 'x-fleet-user-preferences',
  THEME: 'x-fleet-theme',
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const

// Form Validation
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const

// UI Constants
export const UI_CONFIG = {
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
} as const
