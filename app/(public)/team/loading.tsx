// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { HeroSkeleton } from "@/components/public/skeletons/hero-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

// This function TeamLoading handles the main work in this file and explains what this logic is doing in simple English.
export default function TeamLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-2 dark:bg-[#09090B] transition-colors">
      <HeroSkeleton
        badgeWidth="w-48"
        hasPhoto={true}
        size="md"
      />

      {/* Executive Committee Section Skeleton */}
      <section className="bg-surface-2 dark:bg-[#09090B] py-20 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <Skeleton className="h-3.5 w-36 rounded-full mb-3" />
            <Skeleton className="h-9 w-56 rounded-xl" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#121214] rounded-3xl border border-primary/10 dark:border-white/10 p-7 flex flex-col items-center text-center shadow-[0_8px_30px_rgba(15,36,96,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
              >
                {/* Circular photo skeleton */}
                <Skeleton className="w-28 h-28 rounded-full mb-5 flex-shrink-0" />

                {/* Name & Role */}
                <Skeleton className="h-5 w-40 rounded-lg mb-2" />
                <Skeleton className="h-6 w-28 rounded-full mb-3" />

                {/* Bio text lines */}
                <div className="space-y-1.5 w-full flex flex-col items-center mb-5">
                  <Skeleton className="h-3 w-44 rounded" />
                  <Skeleton className="h-3 w-32 rounded" />
                </div>

                {/* Social icons row */}
                <div className="flex items-center gap-2 mt-auto">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Leads Section Skeleton */}
      <section className="py-20 bg-surface-2 dark:bg-[#09090B] border-t border-primary/10 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <Skeleton className="h-3.5 w-32 rounded-full mb-3" />
            <Skeleton className="h-9 w-64 rounded-xl" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#121214] rounded-3xl border border-primary/10 dark:border-white/10 p-7 flex flex-col items-center text-center shadow-[0_8px_30px_rgba(15,36,96,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
              >
                <Skeleton className="w-28 h-28 rounded-full mb-5 flex-shrink-0" />
                <Skeleton className="h-5 w-36 rounded-lg mb-2" />
                <Skeleton className="h-6 w-32 rounded-full mb-3" />
                <div className="space-y-1.5 w-full flex flex-col items-center">
                  <Skeleton className="h-3 w-40 rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
