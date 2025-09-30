'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CenterHubAnimation from '@/components/common/centerhubanimaton'
import LoginForm from '@/components/common/loginform'


export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-white pb-16">
      {/* Header: logo + social icons */}
      <header className="w-full mt-10">
        <div className="container mx-auto px-4 md:px-8 py-6 flex items-center justify-between">
          <img
            src="/images/fleetstack-logo.png"
            alt="Fleet Stack Logo"
            width={200}
            height={60}
            className="h-auto w-[160px] md:w-[200px]"
          />
          {/* <p>list of icons</p> */}
        </div>
      </header>

      {/* Middle: 7/5 column split */}
      <main className="flex-1">
        <div className="flex flex-col md:flex-row min-h-[60vh]">
          {/* Left column (7) */}
          <div className="hidden md:block  flex-[7] p-6 md:p-8 flex">
            <CenterHubAnimation />
          </div>

          {/* Right column (5) */}
          <div className="flex-[5] p-6 mr-10 md:p-10 flex justify-center items-center">
            <LoginForm />
          </div>
        </div>
      </main>

      {/* Fixed footer */}
      <footer className="fixed bottom-0 left-0 right-0 w-full bg-white text-neutral-800 text-center py-3">
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>
    </div>
  )
}
