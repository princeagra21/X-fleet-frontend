import { CustomInput, PasswordInput } from '@/components/form/custominput'
import React from 'react'

function page() {
  return (
   <div className="min-h-screen grid place-items-center bg-neutral-50 dark:bg-neutral-950 p-6">
      <div className="w-full max-w-sm grid gap-5">
        {/* 1) Email with icon by name */}
        <CustomInput
          id="email"
          label="Email"
          placeholder="you@company.com"
          leadingIconName="FaUser"
          showCounter
          maxLength={60}
         
          
        />

        {/* 2) Password with icon by name + reveal button */}
        <PasswordInput
          id="pwd"
          label="Password"
          placeholder="••••••••"
          leadingIconName="FaLock"
         
         
        />

        {/* 3) Success tone with trailing check icon by name */}
        <CustomInput
          id="company"
          label="Company"
          placeholder="Fleet Stack"
          hint="Looks good."
         
          trailingIconName="FaCheck"
          
        />

        {/* 4) Error tone with warning icon */}
        <CustomInput
          id="project"
          label="Project"
          placeholder="Enter project"
          error="This field is required"
          leadingIconName="FaExclamationTriangle"
         
         
        />

        {/* 5) Disabled example */}
        <CustomInput
          id="loading"
          label="Disabled"
          placeholder="N/A"
          leadingIconName="FaSpinner" // static icon (use CSS to animate if needed)
          disabled
        />
      </div>
    </div>
  )
}

export default page