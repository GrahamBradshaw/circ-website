// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react"
import { cn, stripHtml } from "@/lib/utils"
import { EventCountdown } from "./event-countdown"

interface EventCardProps {
  id: string
  title: string
  description: string
  date: Date | string
  venue?: string
  coverImage: string
  type: string
}

interface EventTheme {
  gradientStyle: React.CSSProperties
  badgeTypeClass: string
  accentColor: string
}

// Autopicks a rich, high-contrast gradient palette that prevents bright or busy cover images
// from washing out the white text, while giving each event a distinct and professional identity.
function getEventTheme(type: string, id: string): EventTheme {
  const normalized = (type || "").toUpperCase().trim()

  switch (normalized) {
    case "HACKATHON":
      return {
        gradientStyle: {
          background:
            "linear-gradient(180deg, rgba(38, 12, 64, 0.82) 0%, rgba(18, 7, 32, 0.45) 32%, rgba(12, 4, 22, 0.92) 72%, rgba(6, 2, 12, 0.98) 100%)",
        },
        badgeTypeClass: "bg-purple-500/25 text-purple-200 border-purple-400/35",
        accentColor: "text-purple-300",
      }
    case "WORKSHOP":
      return {
        gradientStyle: {
          background:
            "linear-gradient(180deg, rgba(6, 42, 50, 0.82) 0%, rgba(4, 24, 30, 0.45) 32%, rgba(2, 15, 19, 0.92) 72%, rgba(1, 8, 10, 0.98) 100%)",
        },
        badgeTypeClass: "bg-teal-500/25 text-teal-200 border-teal-400/35",
        accentColor: "text-teal-300",
      }
    case "TALK":
      return {
        gradientStyle: {
          background:
            "linear-gradient(180deg, rgba(62, 28, 8, 0.82) 0%, rgba(32, 14, 5, 0.45) 32%, rgba(18, 7, 3, 0.92) 72%, rgba(10, 4, 1, 0.98) 100%)",
        },
        badgeTypeClass: "bg-amber-500/25 text-amber-200 border-amber-400/35",
        accentColor: "text-amber-300",
      }
    case "MENTORSHIP":
      return {
        gradientStyle: {
          background:
            "linear-gradient(180deg, rgba(5, 46, 30, 0.82) 0%, rgba(3, 24, 16, 0.45) 32%, rgba(2, 16, 10, 0.92) 72%, rgba(1, 8, 5, 0.98) 100%)",
        },
        badgeTypeClass: "bg-emerald-500/25 text-emerald-200 border-emerald-400/35",
        accentColor: "text-emerald-300",
      }
    case "RESEARCH":
      return {
        gradientStyle: {
          background:
            "linear-gradient(180deg, rgba(14, 36, 68, 0.82) 0%, rgba(8, 20, 38, 0.45) 32%, rgba(4, 11, 24, 0.92) 72%, rgba(2, 6, 14, 0.98) 100%)",
        },
        badgeTypeClass: "bg-sky-500/25 text-sky-200 border-sky-400/35",
        accentColor: "text-sky-300",
      }
    default: {
      const palettes = [
        {
          gradient:
            "linear-gradient(180deg, rgba(22, 28, 50, 0.82) 0%, rgba(10, 14, 28, 0.45) 32%, rgba(6, 8, 18, 0.92) 72%, rgba(3, 4, 10, 0.98) 100%)",
          badge: "bg-indigo-500/25 text-indigo-200 border-indigo-400/35",
          accent: "text-indigo-300",
        },
        {
          gradient:
            "linear-gradient(180deg, rgba(48, 20, 32, 0.82) 0%, rgba(25, 10, 18, 0.45) 32%, rgba(15, 6, 11, 0.92) 72%, rgba(8, 3, 6, 0.98) 100%)",
          badge: "bg-rose-500/25 text-rose-200 border-rose-400/35",
          accent: "text-rose-300",
        },
        {
          gradient:
            "linear-gradient(180deg, rgba(15, 40, 48, 0.82) 0%, rgba(8, 22, 28, 0.45) 32%, rgba(4, 14, 18, 0.92) 72%, rgba(2, 7, 10, 0.98) 100%)",
          badge: "bg-cyan-500/25 text-cyan-200 border-cyan-400/35",
          accent: "text-cyan-300",
        },
      ]
      let hash = 0
      const key = `${id}-${type}`
      for (let i = 0; i < key.length; i++) {
        hash = (hash << 5) - hash + key.charCodeAt(i)
        hash |= 0
      }
      const selected = palettes[Math.abs(hash) % palettes.length]
      return {
        gradientStyle: { background: selected.gradient },
        badgeTypeClass: selected.badge,
        accentColor: selected.accent,
      }
    }
  }
}

// This function EventCard handles the main work in this file and explains what this logic is doing in simple English.
export function EventCard({ id, title, description, date, venue, coverImage, type }: EventCardProps) {
  const theme = getEventTheme(type, id)
  const summary = stripHtml(description).slice(0, 120)
  const dateObj = new Date(date)

  return (
    <Link
      href={`/events/${id}`}
      aria-label={`View details for ${title}`}
      className="event-card group relative isolate flex h-[420px] w-full flex-col justify-end overflow-hidden rounded-[1.25rem] bg-[#121214] text-white shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_45px_rgba(0,0,0,0.35)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-orange/50"
    >
      {/* Background full-bleed cover image */}
      <Image
        src={coverImage}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
        className="absolute inset-0 -z-20 h-full w-full object-cover brightness-[0.78] saturate-[1.12] contrast-[0.92] transition-all duration-500 group-hover:scale-105 group-hover:brightness-[0.86]"
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/5 via-black/10 to-black/90" />

      {/* Top badges (Date, Location, Event Type) positioned over the top protective scrim */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 px-3 py-1 font-mono text-[11px] font-bold text-white shadow-sm flex-shrink-0">
            <CalendarDays size={12} className="text-accent-orange" />
            {format(dateObj, "MMM dd, yyyy")}
          </span>
          {venue && (
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 px-2.5 py-1 font-mono text-[10px] text-zinc-300 truncate max-w-[140px]">
              <MapPin size={11} className="text-accent-orange flex-shrink-0" />
              <span className="truncate">{venue}</span>
            </span>
          )}
        </div>
        <span
          className={cn(
            "rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm flex-shrink-0",
            theme.badgeTypeClass
          )}
        >
          {type}
        </span>
      </div>

      {/* Card Content pushed to bottom */}
      <div className="relative z-10 p-6 pt-12 flex flex-col justify-end">
        <h3 className="font-display text-xl sm:text-2xl font-bold leading-snug text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-2 transition-colors">
          {title}
        </h3>

        <p className="mt-2 line-clamp-2 font-body text-sm leading-relaxed text-zinc-200/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {summary}
          {summary.length >= 120 ? "…" : ""}
        </p>

        <EventCountdown date={dateObj} />

        {/* Bottom action row with subtle divider */}
        <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3.5">
          <span className="font-body text-xs font-semibold uppercase tracking-wider text-accent-orange group-hover:text-orange-400 transition-colors flex items-center gap-1.5">
            View Details
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
          <span className="text-[11px] font-mono text-zinc-400">
            CIRC Event
          </span>
        </div>
      </div>
    </Link>
  )
}

