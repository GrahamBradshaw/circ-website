// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
"use client"

import { useEffect, useState } from "react"

const EVENT_DURATION_MS = 4 * 60 * 60 * 1000

type Countdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getCountdown(start: number, now: number): Countdown | null {
  const distance = start - now
  if (distance <= 0) return null

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
  }
}

// This function EventCountdown handles the main work in this file and explains what this logic is doing in simple English.
export function EventCountdown({ date }: { date: Date | string }) {
  const start = new Date(date).getTime()
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    const update = () => setNow(Date.now())
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [])

  if (now === null || Number.isNaN(start)) {
    return <div className="mt-4 h-9" aria-hidden="true" />
  }

  const countdown = getCountdown(start, now)
  const isOngoing = now >= start && now < start + EVENT_DURATION_MS

  if (isOngoing) {
    return (
      <span className="mt-4 inline-flex w-fit items-center rounded-full border border-emerald-200/70 bg-emerald-500/50 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_0_18px_rgba(52,211,153,0.35)]">
        <span className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-white" aria-hidden="true" />
        Ongoing
      </span>
    )
  }

  if (!countdown) return null

  const units = [
    { key: "days", label: countdown.days === 1 ? "Day" : "Days", value: countdown.days },
    { key: "hours", label: countdown.hours === 1 ? "Hour" : "Hours", value: countdown.hours },
    { key: "minutes", label: countdown.minutes === 1 ? "Min" : "Mins", value: countdown.minutes },
    { key: "seconds", label: countdown.seconds === 1 ? "Sec" : "Secs", value: countdown.seconds },
  ].filter((unit) => unit.value > 0 || unit.key === "seconds")

  return (
    <div className="mt-4 flex w-fit items-center gap-1.5 rounded-xl border border-orange-300/50 bg-black/75 px-2.5 py-2 shadow-[0_0_20px_rgba(249,115,22,0.2)] backdrop-blur-sm" aria-label="Time until event starts">
      <span className="mr-0.5 font-mono text-[9px] font-extrabold uppercase tracking-wider text-orange-300">Starts in</span>
      {units.map((unit) => (
        <span key={unit.label} className="inline-flex min-w-[50px] items-baseline justify-center gap-1 rounded-md bg-orange-500 px-2 py-1 font-mono text-white shadow-sm">
          <span className="text-sm font-extrabold tabular-nums">{String(unit.value).padStart(2, "0")}</span>
          <span className="text-[9px] font-bold text-white/95">{unit.label}</span>
        </span>
      ))}
    </div>
  )
}
