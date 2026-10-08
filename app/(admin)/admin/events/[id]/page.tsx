// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { notFound } from "next/navigation"
import { prisma, safeDbQuery } from "@/lib/prisma"
import { EventForm } from "@/components/admin/forms/event-form"

// This function EditEventPage handles the main work in this file and explains what this logic is doing in simple English.
export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await safeDbQuery(() => prisma.event.findUnique({
    where: { id },
  }), null)

  if (!event) notFound()

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-primary text-2xl font-bold">Edit Event</h1>
        <p className="font-body text-muted text-sm mt-1">Update the event details below.</p>
      </div>
      <EventForm event={event} />
    </div>
  )
}
