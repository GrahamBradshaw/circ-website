// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { HeroSkeleton } from "@/components/public/skeletons/hero-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

// This function JoinLoading handles the main work in this file and explains what this logic is doing in simple English.
export default function JoinLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-2 dark:bg-[#09090B] transition-colors">
      <HeroSkeleton
        badgeWidth="w-52"
        hasPhoto={true}
        hasPills={true}
        size="md"
      />

      <section className="bg-surface-2 dark:bg-[#09090B] py-16 transition-colors">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white dark:bg-[#121214] rounded-3xl p-8 sm:p-12 border border-primary/10 dark:border-white/10 shadow-[0_10px_35px_rgba(15,36,96,0.05)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.6)] space-y-6">
            
            {/* Form Section 1: Personal Details */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-44 rounded-lg" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-24 rounded" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-28 rounded" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              </div>
            </div>

            {/* Form Section 2: Academic Info */}
            <div className="space-y-4 pt-4 border-t border-primary/5 dark:border-white/10">
              <Skeleton className="h-6 w-36 rounded-lg" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-32 rounded" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-28 rounded" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-24 rounded" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            </div>

            {/* Form Section 3: Community Interests */}
            <div className="space-y-4 pt-4 border-t border-primary/5 dark:border-white/10">
              <Skeleton className="h-6 w-48 rounded-lg" />
              <div className="flex flex-wrap gap-2">
                {["w-32", "w-40", "w-36", "w-28", "w-44", "w-32", "w-36"].map((w, i) => (
                  <Skeleton key={i} className={`h-8 ${w} rounded-full`} />
                ))}
              </div>
            </div>

            {/* Motivation Textarea */}
            <div className="space-y-2 pt-4 border-t border-primary/5 dark:border-white/10">
              <Skeleton className="h-3.5 w-48 rounded" />
              <Skeleton className="h-28 w-full rounded-2xl" />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Skeleton className="h-12 w-full rounded-full" />
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
