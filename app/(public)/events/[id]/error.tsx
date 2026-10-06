// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
'use client'
// This function Error handles the main work in this file and explains what this logic is doing in simple English.
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h2 className="font-display text-primary text-3xl font-bold mb-4">Something went wrong</h2>
      <p className="font-body text-muted text-sm mb-6">{error.message}</p>
      <button onClick={reset} className="btn-primary">Try again</button>
    </div>
  )
}
