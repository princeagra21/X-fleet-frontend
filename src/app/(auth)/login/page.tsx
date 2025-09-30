'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/forms/LoginForm'
import { authService } from '@/lib/api/auth'
import { ROUTES } from '@/constants'
import type { LoginFormData } from '@/lib/validations'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      // This shows how to call your external API
      // Replace with your actual backend API endpoint
      console.log('🚀 API Call Example:')
      console.log('Method: POST')
      console.log('URL: https://your-api.com/api/auth/login')
      console.log('Payload:', {
        email: data.email,
        password: '[HIDDEN]', // Never log actual passwords
        remember: data.remember
      })
      
      // Example of calling the authentication service
      // This will make a real API call to your backend
      const response = await authService.login({
        email: data.email,
        password: data.password,
        remember: data.remember
      })

      // If API call succeeds, handle the response
      console.log('✅ Login API Response:', {
        success: true,
        user: response.user,
        hasTokens: !!(response.access_token && response.refresh_token)
      })
      
      // Show success and redirect
      alert(`Welcome back, ${response.user.name}!\nRedirecting to dashboard...`)
      router.push(ROUTES.DASHBOARD)
      
    } catch (error) {
      // Handle API errors
      console.error('❌ API Error:', error)
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Login failed. Please check your credentials and try again.'
        
      alert(`Login Error: ${errorMessage}\n\nNote: This is a frontend-only demo.\nConnect your backend API to make this functional.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-[--color-primary-color]/20 to-[--color-secondary-color]/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-r from-[--color-secondary-color]/20 to-[--color-primary-color]/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-r from-[--color-primary-color]/20 to-[--color-secondary-color]/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 font-mono">
            © 2025 X-Fleet. All rights reserved.
          </p>
          <div className="mt-2 flex items-center justify-center space-x-4 text-xs text-gray-400">
            <span className="font-primary">Font: Inter</span>
            <span className="font-secondary">Font: Satoshi Bold</span>
            <span className="font-mono">Font: IBM Plex Mono</span>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
