// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

// This constant metadata stores shared values used by this file so the logic stays easier to follow.
export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The requested CIRC website page could not be found.",
  robots: { index: false, follow: false },
}

// This function NotFound handles the main work in this file and explains what this logic is doing in simple English.
export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-2 flex flex-col items-center justify-center px-6 text-center">
      <Image src="/logo.webp" alt="CIRC" width={64} height={64} className="object-contain mb-6" />
      <h1 className="font-display text-primary text-8xl font-bold mb-4">404</h1>
      <h2 className="font-display text-primary text-2xl font-bold mb-3">Page Not Found</h2>
      <p className="font-body text-muted text-sm max-w-sm mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="btn-primary">Go to Homepage</Link>
    </div>
  )
}
