// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { cn } from "@/lib/utils"

// This function Skeleton handles the main work in this file and explains what this logic is doing in simple English.
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-slate-200/80 dark:bg-white/[0.07]",
        className
      )}
      {...props}
    />
  )
}
