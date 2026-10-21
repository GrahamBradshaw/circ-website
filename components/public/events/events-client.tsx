// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
"use client"

import { useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { EventCard } from "./event-card"
import { cn } from "@/lib/utils"

interface Event {
  id: string
  title: string
  description: string
  date: Date
  coverImage: string
  type: string
}

interface EventsClientProps {
  events: Event[]
  featuredEvent: Event | null
}

// This function EventsClient handles the main work in this file and explains what this logic is doing in simple English.
export function EventsClient({ events, featuredEvent }: EventsClientProps) {
  const [activeTab, setActiveTab] = useState<string>("ALL")

  const filteredEvents = events.filter(e => {
    if (activeTab === "ALL") return true
    return e.type === activeTab
  })

  const types = ["ALL", "HACKATHON", "WORKSHOP", "TALK", "MENTORSHIP", "RESEARCH"]

  return (
    <div className="flex flex-col">
      {/* Featured upcoming event banner */}
      {featuredEvent && (
        <section className="relative h-96 overflow-hidden">
          <Image 
            src={featuredEvent.coverImage} 
            alt={featuredEvent.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
          
          <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center text-white">
            <span className={cn("badge-type-hackathon mb-4 inline-block bg-accent-orange text-white border-none", `badge-type-${featuredEvent.type.toLowerCase()}`)}>
              Featured: {featuredEvent.type}
            </span>
            <h1 className="font-display text-white text-4xl md:text-5xl font-bold mb-3">
              {featuredEvent.title}
            </h1>
            <div className="font-body text-white/80 text-sm flex items-center gap-4 mb-6">
              <span>{format(new Date(featuredEvent.date), "MMMM dd, yyyy")}</span>
              <span>•</span>
              <span>MNU Main Hall</span>
            </div>

            <a href={featuredEvent.id} className="btn-primary-lg">
              Register Now
            </a>
          </div>
        </section>
      )}

      {/* Filter controls */}
      <div className="bg-surface-2/90 dark:bg-[#0C0C0E]/90 backdrop-blur-md border-b border-primary/10 dark:border-white/10 sticky top-16 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-2.5 overflow-x-auto no-scrollbar">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={cn(
                "font-body text-xs sm:text-sm font-semibold px-5 py-2 rounded-full border transition-all duration-200 whitespace-nowrap shadow-sm",
                activeTab === type 
                  ? "bg-primary text-white border-primary shadow-md dark:bg-white dark:text-black dark:border-white" 
                  : "bg-white/80 dark:bg-[#18181B] text-primary/70 dark:text-gray-300 border-primary/10 dark:border-white/10 hover:border-primary/30 dark:hover:border-white/30 hover:bg-white dark:hover:bg-[#222226] hover:text-primary dark:hover:text-white"
              )}
            >
              {type === "ALL" ? "All Events" : type.charAt(0) + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Events grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {filteredEvents.length > 0 ? (
          <div className="event-card-grid grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#121214] rounded-3xl border border-dashed border-primary/20 dark:border-white/15">
            <p className="font-body text-muted dark:text-gray-400 italic text-base">No events found matching this filter.</p>
          </div>
        )}
      </section>
    </div>
  )
}
