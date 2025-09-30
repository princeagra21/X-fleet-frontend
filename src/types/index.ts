// Auth types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'user' | 'manager'
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterCredentials extends LoginCredentials {
  name: string
  confirmPassword: string
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Common UI types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'tel'
  placeholder?: string
  required?: boolean
  validation?: ValidationRule[]
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern'
  value?: string | number
  message: string
}

// Theme types
export interface ThemeColors {
  primaryColor: string
  secondaryColor: string
}

export interface FontConfig {
  primaryFont: string
  secondaryFont: string
  numberFont: string
}