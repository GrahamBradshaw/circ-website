// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import Link from "next/link"

// This function JoinCTA handles the main work in this file and explains what this logic is doing in simple English.
export function JoinCTA() {
  return (
    <section className="bg-primary dark:bg-[radial-gradient(ellipse_at_top,_#181822_0%,_#111116_65%,_#0B0B0E_100%)] py-24 relative overflow-hidden border-t border-black/10 dark:border-white/10 transition-colors">
      {/* Background SVG grid */}
      <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-display text-white text-5xl font-bold leading-tight">
          Ready to Build the Future?
        </h2>
        <p className="font-body text-accent-sky text-lg mt-4 leading-relaxed">
          Join a community of innovators and builders at Mama Ngina University College. 
          Bridge the gap between theoretical computing and real-world impact.
        </p>
        
        <Link href="/join" className="btn-primary-lg mt-10 mx-auto inline-flex">
          Apply for Membership
        </Link>
        <p className="mt-8 text-white/30 font-body text-xs uppercase tracking-widest">
          Registration is open for the {new Date().getFullYear()} intake
        </p>
      </div>
    </section>
  )
}
