'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { APP_CONFIG } from '@/constants'

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>
  isLoading?: boolean
}

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  })

  const isFormLoading = isLoading || isSubmitting

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="space-y-2 text-center pb-6">
        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-[--color-primary-color] to-[--color-secondary-color] rounded-xl flex items-center justify-center mb-4">
          <span className="text-white font-secondary text-xl font-bold">XF</span>
        </div>
        <CardTitle className="text-2xl font-secondary text-gray-900">
          Welcome to {APP_CONFIG.name}
        </CardTitle>
        <CardDescription className="text-gray-600">
          Sign in to access your fleet management dashboard
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className={`pl-10 h-12 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                {...register('email')}
                disabled={isFormLoading}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={`pl-10 pr-10 h-12 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                {...register('password')}
                disabled={isFormLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isFormLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 font-medium">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-[--color-primary-color] border-gray-300 rounded focus:ring-[--color-primary-color] focus:ring-2"
                {...register('remember')}
                disabled={isFormLoading}
              />
              <Label htmlFor="remember" className="text-sm text-gray-700">
                Remember me
              </Label>
            </div>
            <Button
              variant="link"
              className="text-sm text-[--color-primary-color] hover:text-[--color-secondary-color] p-0 h-auto font-medium"
              type="button"
              disabled={isFormLoading}
            >
              Forgot password?
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-[--color-primary-color] to-[--color-secondary-color] hover:from-[--color-secondary-color] hover:to-[--color-primary-color] text-white font-secondary font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={isFormLoading}
          >
            {isFormLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="text-center pt-6">
        <div className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Button
            variant="link"
            className="text-[--color-primary-color] hover:text-[--color-secondary-color] p-0 h-auto font-medium"
            disabled={isFormLoading}
          >
            Sign up
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
