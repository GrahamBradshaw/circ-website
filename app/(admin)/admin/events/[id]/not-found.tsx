// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import Link from "next/link"

// This function EventNotFound handles the main work in this file and explains what this logic is doing in simple English.
export default function EventNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h2 className="font-display text-primary text-3xl font-bold mb-3">Event Not Found</h2>
      <p className="font-body text-muted text-sm mb-6">This event may have been deleted.</p>
      <Link href="/admin/events" className="btn-primary text-sm">Back to Events</Link>
    </div>
  )
}
