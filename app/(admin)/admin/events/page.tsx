// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { prisma } from "@/lib/prisma"
import { EventsTable } from "@/components/admin/events-table"
import Link from "next/link"
import { Plus } from "lucide-react"

// This function EventsPage handles the main work in this file and explains what this logic is doing in simple English.
export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
  })

  const serialized = events.map(e => ({
    ...e,
    date: e.date.toISOString(),
    createdAt: e.createdAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-primary text-2xl font-bold">Events</h1>
          <p className="font-body text-muted text-sm mt-1">{events.length} total events</p>
        </div>
        <Link href="/admin/events/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> New Event
        </Link>
      </div>
      <EventsTable initialEvents={serialized} />
    </div>
  )
}
