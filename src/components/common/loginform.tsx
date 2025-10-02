'use client'
import React from 'react'
import SocialIcons from './socialicons'
import { FaGoogle, FaSignInAlt } from 'react-icons/fa'

/**
 * Design-compact form:
 * - Width: ~30% wider (max-w ~ 676px)
 * - Height: ~5–10% shorter via tighter paddings, gaps, and type scale (no transforms)
 * - Extra compact rules apply on short viewports using height-based media in Tailwind arbitrary variants
 */
const LoginForm = () => {
  return (
    <section className="w-full flex justify-center px-4">
      <div
        className={[
          // 30% wider card
          'w-full max-w-[676px]',
          'rounded-2xl bg-white shadow-xl ring-2 ring-black/5',
          // generous by default, compact on shorter heights
          'p-6 sm:p-8 xl:p-10',
          // height-aware compacting (no scaling, just tighter paddings)
          '[@media(max-height:860px)]:p-6',
          '[@media(max-height:780px)]:p-5',
        ].join(' ')}
      >
        {/* Title */}
        <h1
          className={[
            'mb-5  tracking-tight text-2xl heading-secondary leading-tight',
            // slightly smaller on shorter heights
            '[@media(max-height:860px)]:text-xl',
            '[@media(max-height:780px)]:text-lg',
            '[@media(max-height:780px)]:mb-4',
          ].join(' ')}
        >
          Sign in
        </h1>

        <form
          className={[
            // global vertical rhythm
            'space-y-4',
            '[@media(max-height:860px)]:space-y-3.5',
            '[@media(max-height:780px)]:space-y-3',
          ].join(' ')}
        >
          {/* Email */}
          <div
            className={[
              'space-y-2',
              '[@media(max-height:860px)]:space-y-1.5',
              '[@media(max-height:780px)]:space-y-1.5',
            ].join(' ')}
          >
            <label
              htmlFor="email"
              className={[
                'block text-sm text-neutral-600 leading-tight',
                '[@media(max-height:780px)]:text-[13px]',
              ].join(' ')}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              className={[
                'w-full rounded-xl bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 outline-none',
                'ring-1 ring-black/10 focus:ring-2 focus:ring-neutral-900/20',
                // input size tuned for height
                'px-4 py-3 text-base leading-tight',
                '[@media(max-height:860px)]:px-3.5 [@media(max-height:860px)]:py-2.5 [@media(max-height:860px)]:text-[15px]',
                '[@media(max-height:780px)]:px-3.5 [@media(max-height:780px)]:py-2.5 [@media(max-height:780px)]:text-sm',
              ].join(' ')}
            />
          </div>

          {/* Password */}
          <div
            className={[
              'space-y-2',
              '[@media(max-height:860px)]:space-y-1.5',
              '[@media(max-height:780px)]:space-y-1.5',
            ].join(' ')}
          >
            <label
              htmlFor="password"
              className={[
                'block text-sm text-neutral-600 leading-tight',
                '[@media(max-height:780px)]:text-[13px]',
              ].join(' ')}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className={[
                'w-full rounded-xl bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 outline-none',
                'ring-1 ring-black/10 focus:ring-2 focus:ring-neutral-900/20',
                'px-4 py-3 text-base leading-tight',
                '[@media(max-height:860px)]:px-3.5 [@media(max-height:860px)]:py-2.5 [@media(max-height:860px)]:text-[15px]',
                '[@media(max-height:780px)]:px-3.5 [@media(max-height:780px)]:py-2.5 [@media(max-height:780px)]:text-sm',
              ].join(' ')}
            />
          </div>

          {/* Row: remember / forgot */}
          <div className="flex items-center justify-between pt-1">
            <label
              className={[
                'flex items-center gap-2 text-sm text-neutral-700 leading-tight',
                '[@media(max-height:780px)]:text-[13px]',
              ].join(' ')}
            >
              <input
                type="checkbox"
                className="size-4 rounded border border-black/20"
              />
              Remember me
            </label>
            <a
              className={[
                'text-sm text-neutral-700 underline underline-offset-4 leading-tight',
                'hover:opacity-80',
                '[@media(max-height:780px)]:text-[13px]',
              ].join(' ')}
              href="#"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="button"
            className={[
              'mt-1.5 w-full cursor-pointer rounded-xl bg-neutral-900 text-white font-medium tracking-wide',
              'transition-all duration-300 ease-out flex items-center justify-center gap-2 group',
              // button height tuned for height
              'py-3 text-base leading-tight',
              'hover:bg-black hover:shadow-xl hover:shadow-neutral-900/25 active:scale-[0.99]',
              '[@media(max-height:860px)]:py-2.5 [@media(max-height:860px)]:text-[15px]',
              '[@media(max-height:780px)]:py-2.5 [@media(max-height:780px)]:text-sm',
            ].join(' ')}
          >
            <FaSignInAlt className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <span className="transition-all  duration-300 group-hover:tracking-wider">
              Sign in
            </span>
          </button>

          {/* Divider (tighter) */}
          <div
            className={[
              'relative py-3 text-center',
              '[@media(max-height:860px)]:py-2.5',
              '[@media(max-height:780px)]:py-2',
            ].join(' ')}
          >
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-black/10" />
            <span
              className={[
                'relative bg-white px-3 text-xs text-neutral-500 leading-none',
                '[@media(max-height:780px)]:text-[11px]',
              ].join(' ')}
            >
              or
            </span>
          </div>

          {/* Google */}
          <button
            type="button"
            className={[
              'w-full cursor-pointer rounded-xl bg-white ring-1 ring-black/10 font-medium tracking-wide',
              'transition-all duration-300 ease-out flex items-center justify-center gap-2 group',
              'py-3 text-base leading-tight',
              'hover:bg-gradient-to-r hover:from-blue-50 hover:to-red-50 hover:ring-2 hover:ring-blue-200/50 hover:shadow-lg hover:shadow-blue-100/50 active:scale-[0.99]',
              '[@media(max-height:860px)]:py-2.5 [@media(max-height:860px)]:text-[15px]',
              '[@media(max-height:780px)]:py-2.5 [@media(max-height:780px)]:text-sm',
            ].join(' ')}
          >
            <FaGoogle className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-[360deg] text-red-500" />
            <span className="transition-all duration-300 group-hover:tracking-wider">
              Continue with Google
            </span>
          </button>

          {/* Links */}
          <div
            className={[
              'flex items-center justify-between pt-3 text-sm text-neutral-700',
              '[@media(max-height:780px)]:text-[13px]',
            ].join(' ')}
          >
            <a href="#" className="underline underline-offset-4 hover:opacity-80">
              Driver Login
            </a>
            <a href="#" className="underline underline-offset-4 hover:opacity-80">
              Create account
            </a>
          </div>

          {/* Social icons */}
          <div
            className={[
              'flex items-center gap-4 text-neutral-900/70',
              '[@media(max-height:780px)]:gap-3',
            ].join(' ')}
          >
            <SocialIcons />
          </div>
        </form>
      </div>
    </section>
  )
}

export default LoginForm
