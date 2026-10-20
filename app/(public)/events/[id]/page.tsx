// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { prisma } from "@/lib/prisma"
import { getPublicCached } from "@/lib/redis-cache"
import { sanitizeRichText } from "@/lib/sanitize"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { Calendar, MapPin, Tag, ExternalLink } from "lucide-react"
import { PageHero } from "@/components/public/page-hero"
import { EventCard } from "@/components/public/events/event-card"
import { createPageMetadata, plainTextDescription, SITE_URL } from "@/lib/seo"

// This constant revalidate stores shared values used by this file so the logic stays easier to follow.
export const revalidate = 300

const FALLBACK_EVENT_IDS = [
  "cmn2raejf0000v34k9m34x077",
  "cmn3czkod0000js04zajoll09",
]

// Pre-render event detail routes so crawlers receive public HTML on first visit.
export async function generateStaticParams() {
  try {
    const events = await prisma.event.findMany({
      where: { published: true },
      select: { id: true },
    })
    const ids = new Set([...FALLBACK_EVENT_IDS, ...events.map(({ id }) => id)])
    return [...ids].map((id) => ({ id }))
  } catch (error) {
    console.error("Event route generation failed; using known public events.", error)
    return FALLBACK_EVENT_IDS.map((id) => ({ id }))
  }
}

// This function generateMetadata handles the main work in this file and explains what this logic is doing in simple English.
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await getPublicCached(`event:metadata:${id}`, () => prisma.event.findFirst({
    where: { id, published: true },
    select: { title: true, description: true, coverImage: true, type: true },
  }), null)
  if (!event) return { title: "Event Not Found", robots: { index: false, follow: false } }

  return createPageMetadata({
    title: event.title,
    description: plainTextDescription(event.description),
    path: `/events/${encodeURIComponent(id)}`,
    image: event.coverImage,
    keywords: ["CIRC event", `${event.type} event`, "technology event Kenya", "Mama Ngina University College event"],
  })
}

// This function EventDetailPage handles the main work in this file and explains what this logic is doing in simple English.
export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const event = await getPublicCached(`event:detail:${id}`, () => prisma.event.findFirst({
    where: { id, published: true },
    include: {
      gallery: true,
      community: {
        select: { name: true, slug: true }
      }
    },
  }), null)

  if (!event) {
    notFound()
  }

  const relatedEvents = await getPublicCached(`event:related:${event.type}:${event.id}`, () => prisma.event.findMany({
    where: {
      type: event.type,
      id: { not: event.id },
      published: true,
    },
    take: 3,
    orderBy: { date: "asc" },
  }), [])

  const safeDescription = sanitizeRichText(event.description)
  const eventUrl = `${SITE_URL}/events/${encodeURIComponent(id)}`
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: plainTextDescription(event.description),
    startDate: new Date(event.date).toISOString(),
    eventStatus: event.date < new Date() ? "https://schema.org/EventCompleted" : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: `${event.venue}, Mama Ngina University College`,
    },
    image: new URL(event.coverImage, SITE_URL).toString(),
    organizer: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Computing Innovation and Research Club (CIRC MNUC)",
      url: SITE_URL,
    },
    url: eventUrl,
    ...(event.regLink && event.date >= new Date() ? { offers: { "@type": "Offer", url: event.regLink, availability: "https://schema.org/InStock" } } : {}),
  }

  return (
    <div className="flex flex-col bg-surface-2 dark:bg-[#09090B] min-h-screen transition-colors">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <PageHero
        badge={event.type}
        title={event.title}
        subtitle={
          new Date(event.date).toLocaleDateString("en-KE", {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
          }) + " · " + event.venue
        }
        size="md"
        image={event.coverImage}
        imageAlt={event.title}
      />

      {/* Main Content Area */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left: Event Details */}
            <div className="lg:col-span-8 space-y-10 bg-white dark:bg-[#121214] rounded-3xl p-6 sm:p-10 lg:p-12 border border-primary/10 dark:border-white/10 shadow-[0_8px_30px_rgba(15,36,96,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
              {/* Show the full uploaded poster in the event details section. Poster uploads are often portrait-oriented, so avoid cropping them into a wide banner. */}
              {event.coverImage && (
                <div className="relative w-full min-h-[360px] sm:min-h-[520px] max-h-[720px] rounded-2xl overflow-hidden border border-primary/10 dark:border-white/10 bg-surface-2 dark:bg-[#1A1A1E] shadow-lg">
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 850px"
                    className="object-contain"
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-6 lg:gap-10 pb-8 border-b border-primary/10 dark:border-white/10">
                <div className="flex items-center gap-3.5 group">
                  <div className="w-12 h-12 rounded-2xl bg-surface-2 dark:bg-[#1A1A1E] border border-primary/10 dark:border-white/10 flex items-center justify-center text-accent-orange flex-shrink-0">
                    <Calendar size={22} />
                  </div>
                  <div>
                    <p className="font-mono text-muted dark:text-gray-400 text-[10px] uppercase tracking-widest font-semibold mb-0.5">Date</p>
                    <p className="font-display font-bold text-primary dark:text-white">{format(new Date(event.date), "MMMM do, yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 group">
                  <div className="w-12 h-12 rounded-2xl bg-surface-2 dark:bg-[#1A1A1E] border border-primary/10 dark:border-white/10 flex items-center justify-center text-primary dark:text-white flex-shrink-0">
                    <MapPin size={22} className="text-accent-orange" />
                  </div>
                  <div>
                    <p className="font-mono text-muted dark:text-gray-400 text-[10px] uppercase tracking-widest font-semibold mb-0.5">Venue</p>
                    <p className="font-display font-bold text-primary dark:text-white">{event.venue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 group">
                  <div className="w-12 h-12 rounded-2xl bg-surface-2 dark:bg-[#1A1A1E] border border-primary/10 dark:border-white/10 flex items-center justify-center text-primary dark:text-white flex-shrink-0">
                    <Tag size={22} className="text-accent-orange" />
                  </div>
                  <div>
                    <p className="font-mono text-muted dark:text-gray-400 text-[10px] uppercase tracking-widest font-semibold mb-0.5">Category</p>
                    <p className="font-display font-bold text-primary dark:text-white">{event.type}</p>
                  </div>
                </div>
              </div>

              <div
                className="prose prose-sm dark:prose-invert max-w-none font-body text-main dark:text-gray-200 leading-relaxed [&>p]:mb-4 [&>h2]:font-display [&>h2]:text-primary [&>h2]:dark:text-white [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
                dangerouslySetInnerHTML={{ __html: safeDescription }}
              />

              {event.gallery.length > 0 && (
                <div className="space-y-6 pt-10 border-t border-primary/10 dark:border-white/10">
                  <h2 className="font-display text-primary dark:text-white text-2xl font-bold">Event Photos</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.gallery.map((img) => (
                      <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group border border-primary/10 dark:border-white/10 shadow-sm">
                        <Image 
                          src={img.url} 
                          alt={img.caption || event.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Sidebar Actions */}
            <div className="lg:col-span-4">
              <div className="p-8 bg-white dark:bg-[#121214] border border-primary/10 dark:border-white/10 rounded-3xl sticky top-24 shadow-[0_8px_30px_rgba(15,36,96,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                <p className="font-mono text-accent-orange text-[10px] font-semibold uppercase tracking-[0.2em] mb-2">
                  Registration
                </p>
                <h3 className="font-display text-primary dark:text-white text-2xl font-bold mb-4">Event RSVP</h3>
                <p className="font-body text-muted dark:text-gray-400 text-sm leading-relaxed mb-6">
                  Reserve your spot to participate in this CIRC session and gain practical experience.
                </p>
                
                {event.regLink ? (
                  <a
                    href={event.regLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-accent-orange px-6 py-3.5 font-body text-sm font-semibold text-white shadow-[0_10px_25px_rgba(249,115,22,0.22)] transition-all hover:bg-orange-600 hover:-translate-y-0.5 active:scale-95"
                  >
                    Register / RSVP
                    <ExternalLink size={16} />
                  </a>
                ) : (
                  <div className="bg-surface-2 dark:bg-[#1A1A1E] rounded-2xl p-4 text-center border border-primary/10 dark:border-white/10">
                    <p className="font-body text-muted dark:text-gray-400 text-sm">Free entry for all MNUC students. Walk-ins welcome.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Events */}
      {relatedEvents.length > 0 && (
        <section className="bg-surface-2 dark:bg-[#09090B] py-20 border-t border-primary/10 dark:border-white/10 transition-colors">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-accent-orange text-[10px] font-semibold uppercase tracking-[0.2em] mb-2">
              Explore More
            </p>
            <h2 className="font-display text-primary dark:text-white text-3xl font-bold mb-10">Related Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map((related) => (
                <EventCard key={related.id} {...related} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
