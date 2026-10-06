// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { cn, stripHtml } from "@/lib/utils"

interface EventCardProps {
  id: string
  title: string
  description: string
  date: Date
  coverImage: string
  type: string
}

// This function EventCard handles the main work in this file and explains what this logic is doing in simple English.
export function EventCard({ id, title, description, date, coverImage, type }: EventCardProps) {
  const typeKey = type.toLowerCase()
  const badgeClass = `badge-type-${typeKey}`

  return (
    <div className="group flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white dark:bg-[#121214] border border-primary/10 dark:border-white/10 p-0 shadow-[0_8px_30px_rgba(15,36,96,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_45px_rgba(15,36,96,0.1)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.8)] hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-48 w-full overflow-hidden" suppressHydrationWarning>
        <Image
          src={coverImage}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          className="w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="inline-block rounded-full bg-accent-orange px-3 py-1 font-mono text-[10px] font-bold text-white shadow-sm">
            {format(date, "MMM dd")}
          </span>
          <span className="inline-block rounded-full bg-white/90 dark:bg-[#18181B]/90 backdrop-blur-sm border border-primary/10 dark:border-white/10 px-3 py-1 font-mono text-[10px] font-bold uppercase text-primary dark:text-white">
            {type}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 line-clamp-2 font-display text-lg font-bold text-primary dark:text-white group-hover:text-accent-orange transition-colors">
          {title}
        </h3>
        <p className="mb-5 line-clamp-2 font-body text-sm text-muted dark:text-gray-400 leading-relaxed transition-colors">
          {stripHtml(description).slice(0, 120)}...
        </p>
        <Link 
          href={`/events/${id}`} 
          className="mt-auto inline-flex items-center gap-1 font-body text-sm font-semibold text-accent-orange hover:text-orange-600 transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  )
}
