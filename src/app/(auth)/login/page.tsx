'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CenterHubAnimation from '@/components/common/centerhubanimaton'
import LoginForm from '@/components/common/loginform'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  return (
    <div className="min-h-dvh h-dvh grid grid-rows-[auto,1fr,auto] bg-white text-gray-900">
      {/* Header */}
      <header className="h-5 mt-5">
        <div className="h-full max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <a href="#" className="inline-flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-block w-8 h-8 rounded-lg bg-gray-900" />
            <span className="text-base md:text-lg">Fleet Stack</span>
          </a>
          <nav className="hidden sm:block">
            <ul className="grid grid-flow-col gap-6 text-sm md:text-sm">
              <li className="text-inter"><a href="#">Tutorials</a></li>
              <li className="text-inter"><a href="#">Rest API</a></li>
              <li className="text-inter"><a href="#">User Guide</a></li>
            </ul>
          </nav>
          <button className="sm:hidden w-9 h-9 rounded-md border" aria-label="Menu" />
        </div>
      </header>

      {/* Main */}
      <main>
        {/* Align grid items to the TOP of the row */}
        <div className="h-full max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-4 grid grid-cols-12 gap-4 md:gap-6 items-start">
          {/* Left (hidden on mobile & tablet) */}
          {/* Make this grid item a FLEX container so child can sit at the top-left */}
          <section className="hidden lg:flex col-span-7">
            <div
              className="
                w-full md:p-6
                flex flex-col items-start justify-start
                min-h-0
                [&>*]:m-0    /* remove any mx-auto / my-auto from direct child */
              "
            >
              <CenterHubAnimation />
            </div>
          </section>

          {/* Right (form) */}
          <section className="col-span-12 lg:col-span-5">
            <div className="h-full w-full px-4 md:p-6">
              <LoginForm />
            </div>
          </section>
        </div>
      </main>

      {/* Footer — force compact size and zero padding */}
      <footer className="fixed bottom-0 left-0 w-full h-8">
        <div className="justify-center items-center text-sm font-inter flex">
          © 2025 Your Company. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
