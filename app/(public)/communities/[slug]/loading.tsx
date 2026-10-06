// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { HeroSkeleton } from "@/components/public/skeletons/hero-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

// This function CommunityDetailLoading handles the main work in this file and explains what this logic is doing in simple English.
export default function CommunityDetailLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-2 dark:bg-[#09090B] transition-colors">
      <HeroSkeleton
        badgeWidth="w-48"
        hasPhoto={false}
        size="md"
      />

      {/* Content Section Skeleton */}
      <section className="py-16 lg:py-24 bg-surface-2 dark:bg-[#09090B] transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Left: Description & Activities */}
            <div className="lg:col-span-2 space-y-10 bg-white dark:bg-[#121214] rounded-3xl p-8 sm:p-12 border border-primary/10 dark:border-white/10 shadow-[0_8px_30px_rgba(15,36,96,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
              {/* Focus areas header */}
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2">
                  <span className="h-px w-6 bg-accent-orange/40" />
                  <Skeleton className="h-3.5 w-24 rounded-full" />
                </div>
                <Skeleton className="h-9 w-64 sm:w-80 rounded-xl" />
                <div className="space-y-2.5 pt-2">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-11/12 rounded-md" />
                  <Skeleton className="h-4 w-4/5 rounded-md" />
                </div>
                {/* Tech tags */}
                <div className="flex flex-wrap gap-2 pt-3">
                  <Skeleton className="h-7 w-20 rounded-full" />
                  <Skeleton className="h-7 w-24 rounded-full" />
                  <Skeleton className="h-7 w-16 rounded-full" />
                  <Skeleton className="h-7 w-28 rounded-full" />
                </div>
              </div>

              {/* What We Do section */}
              <div className="space-y-6 pt-6 border-t border-primary/10 dark:border-white/10">
                <Skeleton className="h-7 w-40 rounded-lg" />
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent-orange/40 flex-shrink-0" />
                      <Skeleton className="h-4 flex-1 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-6">
              <div className="sticky top-24 space-y-6">
                <Skeleton className="h-3.5 w-28 rounded-full" />

                {/* Lead Card */}
                <div className="bg-white dark:bg-[#121214] rounded-3xl border border-primary/10 dark:border-white/10 p-6 text-center flex flex-col items-center shadow-[0_10px_30px_rgba(15,36,96,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  {/* Photo circle */}
                  <Skeleton className="w-28 h-28 rounded-full mb-4 flex-shrink-0" />
                  <Skeleton className="w-36 h-5 rounded-lg mb-2" />
                  <Skeleton className="w-28 h-6 rounded-full mb-4" />
                  <div className="space-y-1.5 w-full flex flex-col items-center mb-4">
                    <Skeleton className="w-40 h-3 rounded" />
                    <Skeleton className="w-32 h-3 rounded" />
                  </div>
                  {/* Social row */}
                  <div className="flex gap-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                </div>

                {/* Join CTA Card */}
                <div className="bg-white dark:bg-[#121214] rounded-3xl border border-primary/10 dark:border-white/10 p-6 space-y-4 shadow-[0_10px_30px_rgba(15,36,96,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <Skeleton className="h-5 w-36 rounded-lg" />
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-4/5 rounded" />
                  <Skeleton className="h-10 w-full rounded-full" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
