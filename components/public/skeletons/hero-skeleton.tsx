import { MapPin } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface HeroSkeletonProps {
  badgeWidth?: string
  hasPhoto?: boolean
  hasPills?: boolean
  size?: "lg" | "md" | "sm"
}

export function HeroSkeleton({
  badgeWidth = "w-36",
  hasPhoto = true,
  hasPills = false,
  size = "md",
}: HeroSkeletonProps) {
  return (
    <section
      className="relative overflow-hidden bg-surface-2 dark:bg-[#09090B] text-main dark:text-gray-100 border-b border-primary/10 dark:border-white/10 transition-colors"
      style={{
        paddingTop: size === "lg" ? "5.5rem" : size === "sm" ? "3.5rem" : "4.5rem",
        paddingBottom: hasPhoto ? "0" : size === "lg" ? "6rem" : size === "sm" ? "4rem" : "5rem",
      }}
    >
      {/* Background ambient lighting blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-4 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/[0.04] dark:bg-accent-orange/[0.03] blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface-2 dark:from-[#09090B] to-transparent" />
      </div>

      {/* Main hero content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Pill badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/10 dark:border-white/10 bg-white/85 dark:bg-[#141416]/90 px-4 py-1.5 shadow-sm backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-accent-green" />
          <Skeleton className={`h-3.5 ${badgeWidth} rounded-full`} />
        </div>

        {/* Title */}
        <Skeleton className="h-10 sm:h-12 w-64 sm:w-96 rounded-2xl mb-4" />

        {/* Subtitle */}
        <div className="space-y-2 w-full max-w-xl flex flex-col items-center">
          <Skeleton className="h-4 w-4/5 rounded-md" />
          <Skeleton className="h-4 w-3/5 rounded-md" />
        </div>

        {/* Optional interactive pills row */}
        {hasPills && (
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full" />
            ))}
          </div>
        )}
      </div>

      {/* Location / Meta breadcrumb */}
      <div className={`flex items-center justify-center gap-2 font-body text-[10px] font-medium uppercase tracking-[0.16em] text-primary/60 dark:text-gray-400 sm:text-xs ${hasPhoto ? "mt-6 pb-6" : "mt-8"}`}>
        <MapPin size={13} className="text-accent-orange" />
        CIRC at Mama Ngina University College
      </div>

      {/* Photo strip placeholder with glowing backdrop */}
      {hasPhoto && (
        <div className="relative w-full overflow-hidden" style={{ height: "340px" }}>
          {/* Ambient radiant aura */}
          <div
            className="pointer-events-none absolute -inset-8 opacity-50 blur-3xl animate-ambient-pulse z-0"
            style={{
              background: "radial-gradient(ellipse at center, rgba(249,115,22,0.25) 0%, rgba(56,189,248,0.18) 45%, transparent 75%)"
            }}
          />

          <div className="relative w-full h-full px-6 sm:px-12 pb-2">
            <Skeleton className="w-full h-full rounded-2xl dark:bg-white/[0.05]" />
          </div>

          {/* Bottom fade gradient */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface-2 dark:from-[#09090B] to-transparent z-10"
            aria-hidden="true"
          />
        </div>
      )}
    </section>
  )
}
