// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const stats = [
  { value: 120, label: "Active Members", suffix: "+" },
  { value: 24, label: "Events Hosted", suffix: "+" },
  { value: 6, label: "Communities", suffix: "" },
  { value: 30, label: "Projects Built", suffix: "+" },
]

// This function StatsCounter handles the main work in this file and explains what this logic is doing in simple English.
export function StatsCounter() {
  const containerRef = useRef<HTMLDivElement>(null)
  const numbersRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    stats.forEach((stat, index) => {
      const target = numbersRef.current[index]
      if (!target) return

      gsap.fromTo(target, 
        { innerText: 0 },
        {
          innerText: stat.value,
          duration: 2,
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true,
          }
        }
      )
    })
  }, [])

  return (
    <section 
      ref={containerRef}
      className="bg-primary py-14 w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="flex items-center font-display text-white text-5xl font-bold tabular-nums">
              <span ref={(el) => { numbersRef.current[i] = el }}>0</span>
              {stat.suffix && <span>{stat.suffix}</span>}
            </div>
            <span className="font-body text-accent-sky text-sm mt-2 font-medium uppercase tracking-widest">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
