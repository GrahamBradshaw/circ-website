// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { UserButton, SignOutButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { ShieldX } from "lucide-react"
import Link from "next/link"

// This function AccessDeniedPage handles the main work in this file and explains what this logic is doing in simple English.
export default async function AccessDeniedPage() {
  const { userId } = await auth()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-2">
      <div className="bg-white rounded-2xl shadow-card px-10 py-12 max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mx-auto mb-6">
          <ShieldX className="w-8 h-8 text-red-500" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-display font-bold text-primary-dark mb-2">
          Access Denied
        </h1>
        <p className="text-muted text-sm leading-relaxed mb-6">
          You are signed in, but your account does not have admin privileges.
          <br />
          Contact a club administrator to request access.
        </p>

        {/* User info */}
        {userId && (
          <div className="flex items-center justify-center gap-3 mb-8 p-3 rounded-xl bg-surface-2">
            <UserButton />
            <span className="text-sm text-muted">Signed in as a regular user</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full py-2.5 rounded-xl bg-primary-dark text-white text-sm font-medium hover:bg-primary transition-colors"
          >
            Go to Home
          </Link>
          <SignOutButton signOutOptions={{ redirectUrl: '/sign-in' }}>
            <button
              className="w-full py-2.5 rounded-xl border border-border text-muted text-sm font-medium hover:bg-surface-2 transition-colors"
            >
              Sign out to switch accounts
            </button>
          </SignOutButton>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-muted uppercase tracking-widest">
        CIRC: Computing Innovation &amp; Research Club
      </p>
    </div>
  )
}
