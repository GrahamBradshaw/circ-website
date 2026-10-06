// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { HeroSkeleton } from "@/components/public/skeletons/hero-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

// This function GalleryLoading handles the main work in this file and explains what this logic is doing in simple English.
export default function GalleryLoading() {
  const cardHeights = [
    "h-72",
    "h-96",
    "h-80",
    "h-64",
    "h-88",
    "h-72",
    "h-96",
    "h-80",
    "h-64",
  ]

  return (
    <div className="flex flex-col min-h-screen bg-surface-2 dark:bg-[#09090B] transition-colors">
      <HeroSkeleton
        badgeWidth="w-36"
        hasPhoto={true}
        size="sm"
      />

      {/* Filter bar skeleton */}
      <div className="bg-surface-2/90 dark:bg-[#0C0C0E]/90 backdrop-blur-md border-b border-primary/10 dark:border-white/10 py-4 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-2.5 overflow-x-auto no-scrollbar">
          {["w-24", "w-32", "w-28", "w-36", "w-24"].map((width, i) => (
            <Skeleton key={i} className={`h-9 ${width} rounded-full flex-shrink-0`} />
          ))}
        </div>
      </div>

      {/* Masonry gallery grid skeleton */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {cardHeights.map((height, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-3xl break-inside-avoid bg-white dark:bg-[#121214] border border-primary/10 dark:border-white/10 shadow-[0_8px_30px_rgba(15,36,96,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] ${height} flex flex-col justify-end p-5`}
            >
              {/* Shimmer background inside the card */}
              <div className="absolute inset-0 bg-slate-200/50 dark:bg-white/[0.04]" />
              {/* Bottom pill badge & title skeleton */}
              <div className="relative z-10 space-y-2">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
