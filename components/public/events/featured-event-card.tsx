import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowUpRight, CalendarDays } from "lucide-react"
import { cn, stripHtml } from "@/lib/utils"

interface FeaturedEventCardProps {
  id: string
  title: string
  description: string
  date: Date
  coverImage: string
  type: string
}

export function FeaturedEventCard({ id, title, description, date, coverImage, type }: FeaturedEventCardProps) {
  const typeKey = type.toLowerCase()
  const badgeClass = `badge-type-${typeKey}`
  const summary = stripHtml(description).slice(0, 120)

  return (
    <Link
      href={`/events/${id}`}
      aria-label={`View details for ${title}`}
      className="group relative isolate flex h-[410px] w-[min(84vw,350px)] flex-shrink-0 flex-col justify-between overflow-hidden rounded-[1.35rem] bg-primary p-5 text-white shadow-[0_12px_35px_rgba(15,36,96,0.12)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(15,36,96,0.22)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-orange/50 sm:h-[450px] sm:w-[360px] sm:p-6"
    >
      <Image src={coverImage} alt="" fill sizes="(max-width: 640px) 84vw, 360px" quality={60} className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-dark/60 via-primary-dark/25 to-primary-dark/95" />

      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-primary/30 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur-md">
          <CalendarDays size={13} className="text-accent-orange" /> {format(date, "MMM dd, yyyy")}
        </span>
        <span className={cn("rounded-full px-3 py-2 text-[9px] font-bold uppercase tracking-wider", badgeClass)}>{type}</span>
      </div>

      <div className="mt-auto pt-12">
        <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/70">CIRC event</p>
        <h3 className="max-w-[18rem] font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">{title}</h3>
        <p className="mt-3 line-clamp-3 font-body text-sm leading-relaxed text-white/80">{summary}{summary.length >= 120 ? "…" : ""}</p>
        <div className="mt-6 flex items-center justify-between border-t border-white/25 pt-4">
          <span className="font-body text-sm font-semibold text-white">View event details</span>
          <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 text-white transition duration-300 group-hover:border-accent-orange group-hover:bg-accent-orange">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </div>
    </Link>
  )
}
