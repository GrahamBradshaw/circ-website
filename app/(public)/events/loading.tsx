// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { HeroSkeleton } from "@/components/public/skeletons/hero-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

// This function EventsLoading handles the main work in this file and explains what this logic is doing in simple English.
export default function EventsLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-2 dark:bg-[#09090B] transition-colors">
      <HeroSkeleton
        badgeWidth="w-44"
        hasPhoto={true}
        size="md"
      />

      {/* Filter controls bar skeleton */}
      <div className="bg-surface-2/90 dark:bg-[#0C0C0E]/90 backdrop-blur-md border-b border-primary/10 dark:border-white/10 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-2.5 overflow-x-auto no-scrollbar">
          {["w-24", "w-28", "w-24", "w-20", "w-28", "w-24"].map((width, i) => (
            <Skeleton key={i} className={`h-9 ${width} rounded-full flex-shrink-0`} />
          ))}
        </div>
      </div>

      {/* Events 3-column grid skeleton */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white dark:bg-[#121214] border border-primary/10 dark:border-white/10 shadow-[0_8px_30px_rgba(15,36,96,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
            >
              {/* Event Image Placeholder with Badges */}
              <div className="relative h-48 w-full p-3 flex items-start gap-2 bg-slate-200/50 dark:bg-white/[0.04]">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              {/* Event Details */}
              <div className="flex flex-1 flex-col p-6">
                <Skeleton className="h-6 w-5/6 rounded-lg mb-3" />
                <div className="space-y-2 mb-6 flex-1">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                </div>
                <Skeleton className="h-4 w-28 rounded-md mt-auto" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
