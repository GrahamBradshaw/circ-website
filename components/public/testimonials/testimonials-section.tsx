"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Quote } from "lucide-react"

export interface Testimonial {
  name: string
  role: string
  quote: string
  photo?: string | null
}

interface TestimonialsSectionProps {
  items: Testimonial[]
  /** Milliseconds each pair stays on screen. */
  intervalMs?: number
}

function Photo({ item }: { item: Testimonial }) {
  if (item.photo) {
    return (
      <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-full border-[3px] border-[#111] shadow-md dark:border-white/30 sm:h-20 sm:w-20">
        <Image src={item.photo} alt={item.name} fill sizes="80px" className="object-cover object-top" />
      </div>
    )
  }
  return (
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#111] bg-accent-orange font-display text-xl font-bold text-white shadow-md dark:border-white/30 sm:h-20 sm:w-20">
      {item.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
    </div>
  )
}

function TestimonialCard({ item }: { item: Testimonial }) {
  // Standard layout for every card: photo + name + role in the left cell,
  // quote in the right cell. No alternation — identical structure always.
  return (
    <article className="relative min-h-[220px] rounded-[30px] border-4 border-[#111] bg-white p-6 shadow-[6px_6px_0_rgba(17,17,17,0.08)] dark:border-white/25 dark:bg-[#121214] dark:shadow-[6px_6px_0_rgba(255,255,255,0.05)] sm:min-h-[240px] sm:p-7">
      <Quote
        aria-hidden="true"
        className="absolute -left-4 -top-4 rotate-180 rounded-full bg-white p-1 text-[#111] shadow-[4px_4px_0_rgba(17,17,17,0.12)] dark:bg-[#121214] dark:text-white"
        size={40}
        fill="currentColor"
      />
      <Quote
        aria-hidden="true"
        className="absolute -bottom-4 -right-4 rounded-full bg-white p-1 text-[#111] shadow-[-4px_-4px_0_rgba(17,17,17,0.12)] dark:bg-[#121214] dark:text-white"
        size={40}
        fill="currentColor"
      />
      <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-2 sm:gap-6">
        {/* Author cell — always first, always centered */}
        <div className="flex flex-col justify-center px-1 text-center sm:px-3">
          <Photo item={item} />
          <p className="mt-3 font-display text-xl font-bold uppercase leading-none tracking-tight text-[#111] dark:text-white sm:text-[28px]">
            {item.name}
          </p>
          <small className="mt-1.5 block text-center text-xs font-semibold uppercase tracking-[0.12em] text-accent-orange sm:text-sm">
            {item.role}
          </small>
        </div>
        {/* Quote cell — always second, always left-aligned */}
        <div className="flex items-center px-1 text-left sm:px-3">
          <p className="font-body text-sm leading-relaxed text-[#333] dark:text-gray-300 sm:text-[15px]">
            &ldquo;{item.quote}&rdquo;
          </p>
        </div>
      </div>
    </article>
  )
}

export function TestimonialsSection({ items, intervalMs = 5000 }: TestimonialsSectionProps) {
  const [start, setStart] = useState(0)
  const count = items.length

  useEffect(() => {
    if (count < 2) return
    const timer = window.setInterval(() => {
      setStart((current) => (current + 1) % count)
    }, intervalMs)
    return () => window.clearInterval(timer)
  }, [count, intervalMs])

  if (count === 0) return null

  // Pair cycle: [0,1] -> [1,2] -> [2,3] -> ... -> [n-1,0]
  const pair: Testimonial[] =
    count >= 2 ? [items[start], items[(start + 1) % count]] : [items[0]]

  return (
    <section aria-labelledby="testimonials-heading" className="border-t border-black/5 bg-white py-16 transition-colors dark:border-white/10 dark:bg-[#0C0C0E] sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-orange">
            <span className="h-px w-6 bg-accent-orange" /> Testimonials
          </p>
          <h2 id="testimonials-heading" className="font-display text-4xl font-bold tracking-tight text-primary dark:text-white sm:text-5xl">
            What Members Say
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-muted dark:text-gray-300 sm:text-lg">
            Voices from the Computing Innovation and Research Club at Mama Ngina University College.
          </p>
        </div>

        {/* Pair swaps with a right-to-left slide; key remount means cards never overlap.
            Desktop shows both cards of the pair; mobile shows only the first (one at a time). */}
        <div key={start} className="animate-slide-rl grid grid-cols-1 gap-7 sm:grid-cols-2 lg:gap-9">
          {pair.map((item, index) => (
            <div key={`${start}-${index}`} className={index === 1 ? "hidden sm:block" : ""}>
              <TestimonialCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
