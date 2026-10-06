// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

type Event = {
  id: string
  title: string
  date: string
  venue: string
  type: string
  published: boolean
}

// This function EventsTable handles the main work in this file and explains what this logic is doing in simple English.
export function EventsTable({ initialEvents }: { initialEvents: Event[] }) {
  const [events, setEvents] = useState(initialEvents)
  const [toast, setToast] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const router = useRouter()

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function togglePublished(id: string, current: boolean) {
    const res = await fetch(`/api/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !current }),
    })
    if (res.ok) {
      setEvents(prev => prev.map(e => e.id === id ? { ...e, published: !current } : e))
      showToast(current ? "Event unpublished" : "Event published")
    } else {
      showToast("Action failed. Please try again.")
    }
  }

  async function deleteEvent(id: string) {
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" })
    if (res.ok) {
      setEvents(prev => prev.filter(e => e.id !== id))
      setConfirmDelete(null)
      showToast("Event deleted")
      router.refresh()
    } else {
      showToast("Delete failed. Please try again.")
    }
  }

  const typeLabel: Record<string, string> = {
    HACKATHON: "Hackathon", WORKSHOP: "Workshop", TALK: "Talk",
    MENTORSHIP: "Mentorship", RESEARCH: "Research", OTHER: "Other",
  }

  const typeBadge: Record<string, string> = {
    HACKATHON: "bg-orange-50 text-orange-700",
    WORKSHOP: "bg-green-50 text-green-700",
    TALK: "bg-sky-50 text-sky-700",
    MENTORSHIP: "bg-purple-50 text-purple-700",
    RESEARCH: "bg-blue-50 text-blue-700",
    OTHER: "bg-gray-50 text-gray-600",
  }

  return (
    <div className="space-y-4">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-primary text-white font-body text-sm px-5 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-border p-6 max-w-sm w-full text-center">
            <h3 className="font-display text-primary text-xl font-bold mb-2">Delete Event?</h3>
            <p className="font-body text-muted text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteEvent(confirmDelete)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-body text-sm py-2.5 rounded-lg transition-colors"
              >Delete</button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 btn-outline text-sm py-2.5"
              >Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-2">
            <tr>
              {["Title", "Date", "Venue", "Type", "Status", "Actions"].map(h => (
                <th key={h} className="font-body text-muted text-xs font-semibold uppercase tracking-wider px-4 py-3 text-left border-b border-border">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center font-body text-muted text-sm italic">No events yet. Create your first event.</td></tr>
            ) : events.map(event => (
              <tr key={event.id} className="hover:bg-surface-2 transition-colors">
                <td className="px-4 py-4 border-b border-border">
                  <span className="font-body text-main text-sm font-medium">{event.title}</span>
                </td>
                <td className="px-4 py-4 border-b border-border font-body text-muted text-xs">
                  {new Date(event.date).toLocaleDateString("en-KE", { day:"numeric", month:"short", year:"numeric" })}
                </td>
                <td className="px-4 py-4 border-b border-border font-body text-muted text-xs">{event.venue}</td>
                <td className="px-4 py-4 border-b border-border">
                  <span className={`font-body text-xs font-medium px-2.5 py-1 rounded-full ${typeBadge[event.type] ?? "bg-gray-50 text-gray-600"}`}>
                    {typeLabel[event.type] ?? event.type}
                  </span>
                </td>
                <td className="px-4 py-4 border-b border-border">
                  <span className={`font-body text-xs font-medium px-2.5 py-1 rounded-full ${event.published ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                    {event.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-4 border-b border-border">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="p-1.5 rounded-md text-muted hover:text-primary hover:bg-surface-2 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => togglePublished(event.id, event.published)}
                      className={`p-1.5 rounded-md transition-colors ${event.published ? "text-muted hover:text-yellow-600 hover:bg-yellow-50" : "text-muted hover:text-green-600 hover:bg-green-50"}`}
                      title={event.published ? "Unpublish" : "Publish"}
                    >
                      {event.published ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(event.id)}
                      className="p-1.5 rounded-md text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
