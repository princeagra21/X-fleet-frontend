import { apiService } from '@/lib/api-client'
import { STORAGE_KEYS } from '@/constants'
import type { 
  User, 
  LoginCredentials, 
  RegisterCredentials, 
  ApiResponse 
} from '@/types'

interface LoginResponse {
  user: User
  access_token: string
  refresh_token: string
  expires_in: number
}

interface RefreshResponse {
  access_token: string
  refresh_token: string
  expires_in: number
}

interface RegisterResponse {
  user: User
  message: string
}

export class AuthService {
  private baseUrl = '/auth'

  // Login user
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>(
        `${this.baseUrl}/login`,
        credentials
      )

      if (response.success && response.data) {
        // Store tokens securely
        const { access_token, refresh_token, user } = response.data
        
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token)
          
          // Store user preferences
          localStorage.setItem(
            STORAGE_KEYS.USER_PREFERENCES, 
            JSON.stringify({ user })
          )
        }

        return response.data
      }

      throw new Error(response.message || 'Login failed')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Register new user
  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      const response = await apiService.post<RegisterResponse>(
        `${this.baseUrl}/register`,
        credentials
      )

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Registration failed')
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  // Refresh access token
  async refreshToken(): Promise<RefreshResponse> {
    const refreshToken = typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
      : null

    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await apiService.post<RefreshResponse>(
        `${this.baseUrl}/refresh`,
        { refresh_token: refreshToken }
      )

      if (response.success && response.data) {
        const { access_token, refresh_token: newRefreshToken } = response.data

        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken)
        }

        return response.data
      }

      throw new Error(response.message || 'Token refresh failed')
    } catch (error) {
      console.error('Token refresh error:', error)
      // Clear invalid tokens
      this.logout()
      throw error
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiService.get<User>(`${this.baseUrl}/me`)

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to get user data')
    } catch (error) {
      console.error('Get current user error:', error)
      throw error
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      const refreshToken = typeof window !== 'undefined'
        ? localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
        : null

      if (refreshToken) {
        // Inform server about logout
        await apiService.post(`${this.baseUrl}/logout`, {
          refresh_token: refreshToken
        }).catch(() => {
          // Ignore logout API errors - we'll clear local storage anyway
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear all stored data
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES)
        localStorage.removeItem(STORAGE_KEYS.THEME)
      }
    }
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<void> {
    try {
      const response = await apiService.post(
        `${this.baseUrl}/password/reset-request`,
        { email }
      )

      if (!response.success) {
        throw new Error(response.message || 'Password reset request failed')
      }
    } catch (error) {
      console.error('Password reset request error:', error)
      throw error
    }
  }

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await apiService.post(
        `${this.baseUrl}/password/reset`,
        { 
          token, 
          password: newPassword 
        }
      )

      if (!response.success) {
        throw new Error(response.message || 'Password reset failed')
      }
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }

  // Change password (authenticated user)
  async changePassword(
    currentPassword: string, 
    newPassword: string
  ): Promise<void> {
    try {
      const response = await apiService.put(
        `${this.baseUrl}/password/change`,
        { 
          current_password: currentPassword,
          new_password: newPassword 
        }
      )

      if (!response.success) {
        throw new Error(response.message || 'Password change failed')
      }
    } catch (error) {
      console.error('Password change error:', error)
      throw error
    }
  }

  // Update user profile
  async updateProfile(profileData: Partial<User>): Promise<User> {
    try {
      const response = await apiService.put<User>(
        `${this.baseUrl}/profile`,
        profileData
      )

      if (response.success && response.data) {
        // Update stored user data
        if (typeof window !== 'undefined') {
          const userPrefs = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)
          if (userPrefs) {
            const parsed = JSON.parse(userPrefs)
            parsed.user = { ...parsed.user, ...response.data }
            localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(parsed))
          }
        }

        return response.data
      }

      throw new Error(response.message || 'Profile update failed')
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    try {
      const response = await apiService.post(
        `${this.baseUrl}/verify-email`,
        { token }
      )

      if (!response.success) {
        throw new Error(response.message || 'Email verification failed')
      }
    } catch (error) {
      console.error('Email verification error:', error)
      throw error
    }
  }
}

// Export singleton instance
export const authService = new AuthService()
