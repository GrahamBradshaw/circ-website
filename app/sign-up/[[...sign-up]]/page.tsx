// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { SignUp } from "@clerk/nextjs"

// This function SignUpPage handles the main work in this file and explains what this logic is doing in simple English.
export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-surface-2 flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="font-display text-primary text-4xl font-bold">CIRC</h1>
        <p className="font-body text-muted text-sm mt-1">Request Access</p>
        <p className="font-body text-muted text-xs mt-2 max-w-xs">
          Create an account. An administrator must grant you admin role via Clerk dashboard before you can access the panel.
        </p>
      </div>
      <SignUp fallbackRedirectUrl="/" />
    </div>
  )
}
