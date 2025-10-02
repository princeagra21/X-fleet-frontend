'use client'
import React from 'react'
import CenterHubAnimation from './centerhubanimaton'
import LoginForm from './loginform'

function LoginPageDesign() {
  return (
     
        <div className="h-full max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-4 grid grid-cols-12 gap-4 md:gap-6 items-start">
          {/* Left (hidden on mobile & tablet) */}
          {/* Make this grid item a FLEX container so child can sit at the top-left */}
          <section className="hidden lg:flex col-span-7 items-start justify-start">
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
  )
}

export default LoginPageDesign