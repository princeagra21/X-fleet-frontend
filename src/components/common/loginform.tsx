'use client'
import React from 'react'
import SocialIcons from './socialicons'
import { FaGoogle, FaSignInAlt } from "react-icons/fa";


const LoginForm = () => {
  return (
    
     <section className="w-full">
              <div className="w-full max-w-xl  rounded-2xl bg-white p-8 sm:p-10 shadow-xl ring-2 ring-black/5">
                <h1 className="text-2xl font-semibold tracking-tight mb-6">Sign in</h1>

                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm text-neutral-600" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      className="w-full rounded-xl bg-neutral-50 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-neutral-900/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm text-neutral-600" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-xl bg-neutral-50 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-neutral-900/20"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-sm text-neutral-700">
                      <input type="checkbox" className="size-4 rounded border border-black/20" />
                      Remember me
                    </label>
                    <a className="text-sm text-neutral-700 underline underline-offset-4" href="#">
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="button"
                    className="mt-2 w-full cursor-pointer rounded-xl bg-neutral-900 text-white py-3 font-medium tracking-wide hover:bg-black hover:scale-[1.02] hover:shadow-xl hover:shadow-neutral-900/25 active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-2 group"
                  >
                    <FaSignInAlt className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                    <span className="transition-all duration-300 group-hover:tracking-wider">Sign in</span>
                  </button>

                  <div className="relative py-3 text-center">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-black/10" />
                    <span className="relative bg-white px-3 text-xs text-neutral-500">or</span>
                  </div>

                  <button
                    type="button"
                    className="w-full cursor-pointer rounded-xl bg-white ring-1 ring-black/10 py-3 font-medium tracking-wide hover:bg-gradient-to-r hover:from-blue-50 hover:to-red-50 hover:ring-2 hover:ring-blue-200/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-100/50 active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-2 group"
                  >
                    <FaGoogle className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-[360deg] text-red-500" />
                    <span className="transition-all duration-300 group-hover:tracking-wider">Continue with Google</span>
                  </button>

                  <div className="flex items-center justify-between pt-4 text-sm text-neutral-700">
                    <a href="#" className="underline underline-offset-4">
                      Driver Login
                    </a>
                    <a href="#" className="underline underline-offset-4">
                      Create account
                    </a>
                  </div>

                  <div className=" flex items-center gap-4 text-neutral-900/70">
                    <SocialIcons />
                    {/* <div className="size-5 rounded bg-neutral-900/80" />
                    <div className="size-5 rounded bg-neutral-900/80" />
                    <div className="size-5 rounded bg-neutral-900/80" /> */}
                  </div>
                </form>
              </div>
            </section>

  )
}

export default LoginForm

