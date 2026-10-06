// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { 
  ClipboardList, 
  Calendar, 
  Users, 
  Image as ImageIcon,
  Plus,
  ArrowRight
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// This function AdminDashboard handles the main work in this file and explains what this logic is doing in simple English.
export default async function AdminDashboard() {
  const [
    appCount, 
    upcomingEventsCount, 
    teamCount, 
    galleryCount,
    recentApps,
    nextEvents
  ] = await Promise.all([
    prisma.application.count(),
    prisma.event.count({ where: { date: { gte: new Date() } } }),
    prisma.teamMember.count(),
    prisma.galleryImage.count(),
    prisma.application.findMany({
      take: 5,
      orderBy: { submittedAt: "desc" },
    }),
    prisma.event.findMany({
      where: { date: { gte: new Date() } },
      take: 3,
      orderBy: { date: "asc" },
    })
  ])

  const stats = [
    { label: "Total Applications", value: appCount, icon: ClipboardList },
    { label: "Upcoming Events", value: upcomingEventsCount, icon: Calendar },
    { label: "Team Members", value: teamCount, icon: Users },
    { label: "Gallery Images", value: galleryCount, icon: ImageIcon },
  ]

  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary text-2xl font-bold">Dashboard</h1>

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface rounded-xl border border-border p-5">
            <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center text-primary mb-3">
              <stat.icon size={20} />
            </div>
            <p className="font-display text-primary text-3xl font-bold">{stat.value}</p>
            <p className="font-body text-muted text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions row */}
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/events/new" className="btn-primary text-sm">
          <Plus size={16} className="mr-2" /> New Event
        </Link>
        <Link href="/admin/team/new" className="btn-primary text-sm">
          <Plus size={16} className="mr-2" /> Add Member
        </Link>
        <Link href="/admin/gallery" className="btn-primary text-sm">
          <Plus size={16} className="mr-2" /> Upload Photo
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications card */}
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-display text-primary text-lg font-semibold">Recent Applications</h2>
            <Link href="/admin/applications" className="font-body text-accent-orange text-sm font-medium hover:underline">
              View All
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-2">
                <tr>
                  <th className="font-body text-muted text-xs font-semibold uppercase tracking-wider px-4 py-3 text-left border-b border-border">Name</th>
                  <th className="font-body text-muted text-xs font-semibold uppercase tracking-wider px-4 py-3 text-left border-b border-border">Department</th>
                  <th className="font-body text-muted text-xs font-semibold uppercase tracking-wider px-4 py-3 text-left border-b border-border">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-surface-2 transition-colors duration-100">
                    <td className="font-body text-main text-sm px-4 py-4 border-b border-border last:border-0">
                      <p className="font-bold">{app.fullName}</p>
                      <p className="text-xs text-muted">{format(app.submittedAt, "MMM d, yyyy")}</p>
                    </td>
                    <td className="font-body text-main text-sm px-4 py-4 border-b border-border last:border-0">{app.department}</td>
                    <td className="font-body text-main text-sm px-4 py-4 border-b border-border last:border-0">
                      <span className={cn(
                        app.status === "PENDING" && "badge-pending",
                        app.status === "APPROVED" && "badge-approved",
                        app.status === "REJECTED" && "badge-rejected"
                      )}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentApps.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center font-body text-muted italic">No recent applications.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Events card */}
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-display text-primary text-lg font-semibold">Upcoming Events</h2>
            <Link href="/admin/events" className="font-body text-accent-orange text-sm font-medium hover:underline">
              Manage
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-2">
                <tr>
                  <th className="font-body text-muted text-xs font-semibold uppercase tracking-wider px-4 py-3 text-left border-b border-border">Event</th>
                  <th className="font-body text-muted text-xs font-semibold uppercase tracking-wider px-4 py-3 text-left border-b border-border">Date</th>
                  <th className="font-body text-muted text-xs font-semibold uppercase tracking-wider px-4 py-3 text-left border-b border-border">Status</th>
                </tr>
              </thead>
              <tbody>
                {nextEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-surface-2 transition-colors duration-100">
                    <td className="font-body text-main text-sm px-4 py-4 border-b border-border last:border-0">
                      <p className="font-bold truncate max-w-[150px]">{event.title}</p>
                    </td>
                    <td className="font-body text-main text-sm px-4 py-4 border-b border-border last:border-0">
                      {format(new Date(event.date), "MMM d, yyyy")}
                    </td>
                    <td className="font-body text-main text-sm px-4 py-4 border-b border-border last:border-0">
                      <span className={event.published ? "badge-published" : "badge-draft"}>
                        {event.published ? "Published" : "Draft"}
                      </span>
                    </td>
                  </tr>
                ))}
                {nextEvents.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center font-body text-muted italic">No upcoming events.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
