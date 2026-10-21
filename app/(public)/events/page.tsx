// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { prisma } from "@/lib/prisma"
import { getPublicCached } from "@/lib/redis-cache"
import { EventsClient } from "@/components/public/events/events-client"
import { PageHero } from "@/components/public/page-hero"
import { createPageMetadata } from "@/lib/seo"
import { startOfDay } from "date-fns"

// This constant revalidate stores shared values used by this file so the logic stays easier to follow.
export const revalidate = 300

// This constant metadata stores shared values used by this file so the logic stays easier to follow.
export const metadata = createPageMetadata({
  title: "Computing and Technology Events in Kenya",
  description: "Find CIRC workshops, talks, hackathons, research activities, and technology events at Mama Ngina University College.",
  path: "/events",
  keywords: ["technology events Kenya", "student hackathons", "computing workshops", "AI events", "research activities", "Mama Ngina University College events"],
})

// This function EventsPage handles the main work in this file and explains what this logic is doing in simple English.
export default async function EventsPage() {
  const now = new Date()
  const today = startOfDay(now)

  const upcomingEvents = await getPublicCached("events:upcoming", () => prisma.event.findMany({
    where: { published: true, date: { gte: today } },
    orderBy: { date: "asc" },
  }), [])

  const pastEvents = await getPublicCached("events:past", () => prisma.event.findMany({
    where: { published: true, date: { lt: today } },
    orderBy: { date: "desc" },
  }), [])

  const events = [...upcomingEvents, ...pastEvents]
  const featuredEvent = upcomingEvents[0] ?? null

  return (
    <div className="flex flex-col min-h-screen bg-surface-2 dark:bg-[#09090B] transition-colors">
      <PageHero
        badge="EVENTS & ACTIVITIES"
        title="What's Happening"
        subtitle="Hackathons, workshops, talks, and mentorship for people who build things."
        size="md"
        image="/hero/hero-bg-3.73468c4c.webp"
        imageAlt="CIRC event photo"
      />
      <div className="flex-1 pb-20 lg:pb-32">
        <EventsClient events={events} featuredEvent={featuredEvent} />
      </div>
    </div>
  )
}
