// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { EventForm } from "@/components/admin/forms/event-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// This function NewEventPage handles the main work in this file and explains what this logic is doing in simple English.
export default function NewEventPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin/events" 
          className="flex items-center gap-2 text-xs font-bold text-muted-main hover:text-primary-main transition-colors uppercase tracking-widest w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to events
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold text-primary-dark tracking-tight">Create New Event</h1>
          <p className="text-sm text-muted-main mt-1">Design and publish a new session for the club.</p>
        </div>
      </div>

      <EventForm />
    </div>
  )
}
