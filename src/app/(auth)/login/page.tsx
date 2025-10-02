'use client'

import Link from 'next/link'
import CenterHubAnimation from '@/components/common/centerhubanimaton'
import LoginForm from '@/components/common/loginform'
import Image from 'next/image'
import LoginPageDesign from '@/components/common/loginpage'
import { useState } from 'react'
import SuperAdminRegister from '@/components/common/superadminregister'

export default function LoginPage() {
 
 

  return (
    <div className="min-h-dvh h-dvh grid grid-rows-[auto,1fr,auto] bg-white text-gray-900">
      {/* Header */}
      <header className="h-5 mt-5">
        <div className="h-full max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <a href="#" className="inline-flex items-center mt-5 gap-2 font-semibold tracking-tight">
            <Image
              src="/images/fleetstack-logo.png"
              alt="Fleet Stack Logo"
              width={200}
              height={60}
              className="h-auto w-[160px] md:w-[200px]"
            />
          </a>
          <nav className="hidden sm:block">
            <ul className="grid grid-flow-col gap-6 text-sm md:text-sm">
              <li> <Link href="#"> Tutorials </Link></li>
              <li> <Link href="#"> Rest API </Link></li>
              <li> <Link href="#"> User Guide </Link></li>
        
            </ul>
          </nav>
         
        </div>
      </header>

      {/* Main */}
      <main>
    <LoginPageDesign /> 
      </main>

      {/* Footer — force compact size and zero padding */}
      <footer className="hidden xl:block fixed bottom-0 left-0 w-full h-8">
        <div className="justify-center items-center text-sm font-inter flex">
          © 2025 Your Company. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
