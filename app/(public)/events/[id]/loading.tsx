// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { HeroSkeleton } from "@/components/public/skeletons/hero-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

// This function EventDetailLoading handles the main work in this file and explains what this logic is doing in simple English.
export default function EventDetailLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-2 dark:bg-[#09090B] transition-colors">
      <HeroSkeleton
        badgeWidth="w-28"
        hasPhoto={false}
        size="md"
      />

      {/* Main Content Area */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left: Event Details */}
            <div className="lg:col-span-8 space-y-10 bg-white dark:bg-[#121214] rounded-3xl p-8 sm:p-12 border border-primary/10 dark:border-white/10 shadow-[0_8px_30px_rgba(15,36,96,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
              {/* Event Specs Bar (Date, Venue, Category) */}
              <div className="flex flex-wrap items-center gap-6 lg:gap-10 pb-8 border-b border-primary/10 dark:border-white/10">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3.5">
                    <Skeleton className="w-12 h-12 rounded-2xl flex-shrink-0" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-16 rounded" />
                      <Skeleton className="h-4 w-28 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Description Prose Skeleton */}
              <div className="space-y-3.5 pt-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-11/12 rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>

              <div className="space-y-3 pt-4">
                <Skeleton className="h-6 w-48 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
              </div>

              {/* Event Photos Skeleton */}
              <div className="space-y-6 pt-10 border-t border-primary/10 dark:border-white/10">
                <Skeleton className="h-7 w-36 rounded-lg" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-2xl" />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Sidebar Actions */}
            <div className="lg:col-span-4">
              <div className="p-8 bg-white dark:bg-[#121214] border border-primary/10 dark:border-white/10 rounded-3xl sticky top-24 shadow-[0_8px_30px_rgba(15,36,96,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] space-y-4">
                <Skeleton className="h-3.5 w-24 rounded-full" />
                <Skeleton className="h-7 w-40 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-4/5 rounded" />
                </div>
                <Skeleton className="h-12 w-full rounded-full mt-4" />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
