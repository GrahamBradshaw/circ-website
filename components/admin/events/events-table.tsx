// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Edit2, Trash2, Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Event {
  id: string
  title: string
  date: Date
  type: string
  published: boolean
}

interface EventsTableProps {
  initialEvents: Event[]
}

// This function EventsTable handles the main work in this file and explains what this logic is doing in simple English.
export function EventsTable({ initialEvents }: EventsTableProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const togglePublished = async (id: string, currentStatus: boolean) => {
    setLoadingId(id)
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentStatus }),
      })
      if (res.ok) {
        setEvents(prev => prev.map(e => e.id === id ? { ...e, published: !currentStatus } : e))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingId(null)
    }
  }

  const deleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return
    
    setLoadingId(id)
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" })
      if (res.ok) {
        setEvents(prev => prev.filter(e => e.id !== id))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-2">
            <tr>
              <th className="font-body text-muted text-xs font-semibold uppercase tracking-wider px-4 py-3 text-left border-b border-border">Title</th>
              <th className="font-body text-muted text-xs font-semibold uppercase tracking-wider px-4 py-3 text-left border-b border-border">Date</th>
              <th className="font-body text-muted text-xs font-semibold uppercase tracking-wider px-4 py-3 text-left border-b border-border">Type</th>
              <th className="font-body text-muted text-xs font-semibold uppercase tracking-wider px-4 py-3 text-left border-b border-border">Status</th>
              <th className="font-body text-muted text-xs font-semibold uppercase tracking-wider px-4 py-3 text-right border-b border-border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-surface-2 transition-colors duration-100 group">
                <td className="font-body text-main text-sm px-4 py-4 border-b border-border last:border-0 font-bold">
                  {event.title}
                </td>
                <td className="font-body text-main text-sm px-4 py-4 border-b border-border last:border-0">
                  {format(new Date(event.date), "MMM d, yyyy")}
                </td>
                <td className="font-body text-main text-sm px-4 py-4 border-b border-border last:border-0">
                  {event.type}
                </td>
                <td className="font-body text-main text-sm px-4 py-4 border-b border-border last:border-0">
                  <span className={event.published ? "badge-published" : "badge-draft"}>
                    {event.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="font-body text-main text-sm px-4 py-4 border-b border-border last:border-0 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {loadingId === event.id ? (
                      <Loader2 size={16} className="animate-spin text-muted" />
                    ) : (
                      <>
                        <Link 
                          href={`/admin/events/${event.id}`}
                          className="p-1.5 rounded-md text-muted hover:text-primary hover:bg-surface-2 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => togglePublished(event.id, event.published)}
                          className={cn(
                            "p-1.5 rounded-md transition-colors",
                            event.published 
                              ? "text-muted hover:text-yellow-600 hover:bg-yellow-50" 
                              : "text-muted hover:text-accent-green hover:bg-green-50"
                          )}
                          title={event.published ? "Unpublish" : "Publish"}
                        >
                          {event.published ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button 
                          onClick={() => deleteEvent(event.id)}
                          className="p-1.5 rounded-md text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center font-body text-muted italic">
                  No events found. Click "Create New Event" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
