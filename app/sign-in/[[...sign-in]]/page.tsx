// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { SignIn } from "@clerk/nextjs"

import Image from "next/image"

// This function SignInPage handles the main work in this file and explains what this logic is doing in simple English.
export default function SignInPage() {
  return (
    <div className="min-h-screen bg-surface-2 flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-3">
          <Image src="/logo.webp" alt="CIRC" width={56} height={56} className="object-contain" />
        </div>
        <h1 className="font-display text-primary text-3xl font-bold">CIRC</h1>
        <p className="font-body text-muted text-sm mt-1">Admin Access</p>
      </div>
      <SignIn fallbackRedirectUrl="/admin" />
    </div>
  )
}
