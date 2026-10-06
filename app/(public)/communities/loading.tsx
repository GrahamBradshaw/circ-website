// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { HeroSkeleton } from "@/components/public/skeletons/hero-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

// This function CommunitiesLoading handles the main work in this file and explains what this logic is doing in simple English.
export default function CommunitiesLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-2 dark:bg-[#09090B] transition-colors">
      <HeroSkeleton
        badgeWidth="w-40"
        hasPhoto={true}
        size="lg"
      />

      {/* Communities 2-column grid skeleton */}
      <section className="bg-surface-2 dark:bg-[#09090B] py-20 transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#121214] rounded-3xl border border-primary/10 dark:border-white/10 p-7 flex flex-col shadow-[0_8px_30px_rgba(15,36,96,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
              >
                {/* Icon + Title */}
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="w-12 h-12 rounded-2xl flex-shrink-0" />
                  <Skeleton className="w-48 h-6 rounded-lg" />
                </div>

                {/* Description lines */}
                <div className="space-y-2 mb-5 flex-1">
                  <Skeleton className="w-full h-4 rounded-md" />
                  <Skeleton className="w-5/6 h-4 rounded-md" />
                </div>

                {/* Tags row */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  <Skeleton className="w-16 h-6 rounded-full" />
                  <Skeleton className="w-20 h-6 rounded-full" />
                  <Skeleton className="w-14 h-6 rounded-full" />
                  <Skeleton className="w-24 h-6 rounded-full" />
                </div>

                {/* Lead + CTA row */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-primary/5 dark:border-white/10">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
                    <div className="space-y-1.5">
                      <Skeleton className="w-24 h-3.5 rounded" />
                      <Skeleton className="w-20 h-2.5 rounded" />
                    </div>
                  </div>

                  <Skeleton className="w-20 h-9 rounded-full flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
