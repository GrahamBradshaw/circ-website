"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, MapPin } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type HeroStats = {
  members?: number
  communities?: number
  eventsRun?: number
  projectsBuilt?: number
}

// ─── Hardcoded Hero Images (5 unique photos, no duplicates) ───────────────────

const HARDCODED_SLIDES = [
  "/hero/hero-bg-1.jpg",
  "/hero/hero-bg-2.jpg",
  "/hero/hero-bg-3.jpg",
  "/hero/hero-bg-4.jpg",
  "/hero/hero-bg-5.jpg",
]

// ─── Hardcoded Stats ──────────────────────────────────────────────────────────

const STATS = [
  { value: 400, label: "Active Members", suffix: "+" },
  { value: 30, label: "Events Hosted", suffix: "+" },
  { value: 7, label: "Communities", suffix: "" },
  { value: 30, label: "Projects Built", suffix: "+" },
]

const N = HARDCODED_SLIDES.length // exactly 5 cards

// ─── Circular 3D Position Calculator ──────────────────────────────────────────
// Calculates smooth continuous positions as a function of circular offset `d`.
// Exactly one card is at d = 0 (the center focal card).
// Wrapping occurs behind at |d| = 2.5 where opacity is 0, ensuring no cards fly across the front.

function getCardState(diff: number, vw: number) {
  const sign = diff >= 0 ? 1 : -1
  const absD = Math.abs(diff)

  // Responsive spread configuration
  let nearX = 42
  let farX = 74
  let nearZ = -480
  let farZ = -860

  if (vw <= 479) {
    nearX = 26
    farX = 52
    nearZ = -300
    farZ = -600
  } else if (vw <= 767) {
    nearX = 32
    farX = 62
    nearZ = -360
    farZ = -700
  } else if (vw <= 991) {
    nearX = 38
    farX = 68
    nearZ = -420
    farZ = -780
  }

  let xPercent = 0
  let z = 0
  let rotateY = 0
  let scale = 1.0
  let opacity = 1.0
  let zIndex = 40

  if (absD <= 1.0) {
    // Transitioning between center (0) and near (1)
    const t = absD
    xPercent = sign * (t * nearX)
    z = t * nearZ
    rotateY = -sign * (t * 16)
    scale = 1.0 - t * 0.12
    opacity = 1.0 - t * 0.32
    zIndex = Math.round(40 - t * 15)
  } else if (absD <= 2.0) {
    // Transitioning between near (1) and far (2)
    const t = absD - 1.0
    xPercent = sign * (nearX + t * (farX - nearX))
    z = nearZ + t * (farZ - nearZ)
    rotateY = -sign * (16 + t * 14)
    scale = 0.88 - t * 0.14
    opacity = 0.68 - t * 0.38
    zIndex = Math.round(25 - t * 15)
  } else {
    // Wrapping behind at |d| between 2.0 and 2.5
    const t = Math.min(absD - 2.0, 0.5) / 0.5
    xPercent = sign * farX
    z = farZ - t * 250
    rotateY = -sign * 30
    scale = 0.74 - t * 0.1
    // Fade out to zero at the back so it wraps invisibly
    opacity = Math.max(0, 0.30 * (1 - t))
    zIndex = 5
  }

  return { xPercent, z, rotateY, scale, opacity, zIndex, isCenter: absD < 0.3 }
}

// ─── 3D Circular Carousel Component ──────────────────────────────────────────

function CircularDeck({ slides = HARDCODED_SLIDES }: { slides?: string[] }) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const rotObj = useRef({ val: 0 })
  const activeDotRef = useRef(0)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const [activeDot, setActiveDot] = useState(0)
  const [vw, setVw] = useState(1280)

  // Track window resize
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // Render cards at a specific continuous rotation value
  const applyRotation = (currentRot: number, currentVw: number) => {
    cardRefs.current.forEach((el, i) => {
      if (!el) return
      // Calculate circular distance from current rotation
      let diff = (i - currentRot) % N
      if (diff > N / 2) diff -= N
      if (diff < -N / 2) diff += N

      const state = getCardState(diff, currentVw)

      gsap.set(el, {
        xPercent: state.xPercent,
        z: state.z,
        rotateY: state.rotateY,
        scale: state.scale,
        opacity: state.opacity,
        zIndex: state.zIndex,
      })

      // Add prominent shadow and border only to the single center card in focus
      if (state.isCenter) {
        el.style.boxShadow = "0 30px 60px -15px rgba(15, 36, 96, 0.35), 0 0 0 1.5px rgba(255, 255, 255, 0.6)"
      } else {
        el.style.boxShadow = "0 15px 35px -10px rgba(0, 0, 0, 0.25)"
      }
    })

    // Update React only when the centered slide changes, not on every GSAP frame.
    const centerIndex = ((Math.round(currentRot) % slides.length) + slides.length) % slides.length
    if (activeDotRef.current !== centerIndex) {
      activeDotRef.current = centerIndex
      setActiveDot(centerIndex)
    }
  }

  // Smooth animation to a target rotation
  const rotateTo = (targetRot: number, duration = 0.85) => {
    if (tweenRef.current) tweenRef.current.kill()

    tweenRef.current = gsap.to(rotObj.current, {
      val: targetRot,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        applyRotation(rotObj.current.val, window.innerWidth)
      },
      onComplete: () => {
        // Keep rotObj bounded within [0, N) to avoid floating point drift
        const normalized = ((rotObj.current.val % N) + N) % N
        rotObj.current.val = normalized
      },
    })
  }

  // Initialize on mount
  useEffect(() => {
    applyRotation(0, window.innerWidth)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-advance every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      rotateTo(rotObj.current.val + 1)
    }, 3500)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Click on a specific card to bring it to center
  const handleCardClick = (cardIndex: number) => {
    let diff = (cardIndex - rotObj.current.val) % N
    if (diff > N / 2) diff -= N
    if (diff < -N / 2) diff += N
    rotateTo(rotObj.current.val + diff)
  }

  // Click on a dot indicator
  const handleDotClick = (dotIndex: number) => {
    let diff = (dotIndex - activeDot) % N
    if (diff > N / 2) diff -= N
    if (diff < -N / 2) diff += N
    rotateTo(rotObj.current.val + diff)
  }

  return (
    <div className="relative flex flex-col items-center gap-6">
      {/* 3D Perspective Stage */}
      <div
        aria-live="polite"
        aria-label="Image carousel"
        className="relative h-[22rem] w-[16.5rem] min-[480px]:h-[25.5rem] min-[480px]:w-[19rem] min-[768px]:h-[29.5rem] min-[768px]:w-[23rem] min-[992px]:h-[35.5rem] min-[992px]:w-[28rem]"
        style={{
          perspective: "3000px",
          transformStyle: "preserve-3d",
          position: "relative",
          transform: "rotateX(0.5deg) rotateY(0deg) rotateZ(0deg)",
        }}
      >
        {slides.map((src, i) => (
          <div
            key={i}
            ref={(el) => { cardRefs.current[i] = el }}
            onClick={() => handleCardClick(i)}
            style={{
              position: "absolute",
              inset: 0,
              transformStyle: "preserve-3d",
              overflow: "hidden",
              borderRadius: "1.875rem",
              cursor: "pointer",
              transition: "box-shadow 0.3s ease",
            }}
          >
            <Image
              src={src}
              alt={`CIRC showcase photo ${i + 1}`}
              fill
              sizes="(max-width: 479px) 264px, (max-width: 767px) 304px, (max-width: 991px) 368px, 448px"
              quality={60}
              priority={i === 0}
              loading="eager"
              draggable={false}
              style={{
                objectFit: "cover",
                borderRadius: "1.875rem",
                display: "block",
                userSelect: "none",
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Controls: Prev / Dots / Next */}
      <div className="relative z-20 flex items-center gap-4">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => rotateTo(rotObj.current.val - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/10 bg-white/80 text-primary shadow-sm backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>

        <ol className="flex items-center gap-1" aria-label="Slide indicators">
          {slides.map((_, i) => (
            <li key={i} className="list-none">
              <button
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={activeDot === i ? "true" : undefined}
                onClick={(e) => {
                  e.stopPropagation()
                  handleDotClick(i)
                }}
                className="flex items-center justify-center p-2 cursor-pointer focus:outline-none rounded-full"
              >
                <span
                  className={`block h-2.5 rounded-full transition-all duration-300 pointer-events-none ${
                    activeDot === i
                      ? "w-8 bg-accent-orange shadow-sm"
                      : "w-2.5 bg-primary/25 hover:bg-primary/50"
                  }`}
                />
              </button>
            </li>
          ))}
        </ol>

        <button
          type="button"
          aria-label="Next slide"
          onClick={() => rotateTo(rotObj.current.val + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/10 bg-white/80 text-primary shadow-sm backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

// ─── TerminalHero (Page Hero Section) ─────────────────────────────────────────

export function TerminalHero({
  stats,
  slides,
}: {
  stats?: HeroStats
  slides?: string[]
} = {}) {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-surface-2 dark:bg-[#080809] text-main dark:text-gray-100 transition-colors">
      {/* Background soft glow and fade matching surface-2 */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-12 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/[0.04] dark:bg-accent-orange/[0.03] blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface-2 dark:from-[#080809] to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1600px] items-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[42%_58%] lg:gap-10">

          {/* Left: headline + stats */}
          <div className="text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/10 dark:border-white/10 bg-white/80 dark:bg-[#141416]/90 px-4 py-2 shadow-sm backdrop-blur-sm sm:mb-7">
              <span className="h-2 w-2 rounded-full bg-accent-green" />
              <span className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-primary dark:text-white sm:text-xs">
                Computing · Innovation · Research
              </span>
            </div>

            <h1 className="max-w-[31rem] font-display text-[clamp(3.2rem,7vw,6.2rem)] font-bold leading-[0.88] tracking-[-0.075em] text-primary dark:text-white transition-colors">
              We build the
              <br />
              <span className="relative inline-block font-extrabold italic text-accent-orange">next generation</span>
            </h1>

            <p className="mt-6 max-w-[32rem] text-base leading-relaxed text-muted dark:text-gray-400 sm:text-lg transition-colors">
              A student-led community at Mama Ngina University College building skills in software, data, AI, and emerging technology.
            </p>

            <div className="mt-8 flex w-full flex-col items-start gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/join"
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-accent-orange px-7 py-3 font-body text-sm font-semibold text-white shadow-[0_10px_25px_rgba(249,115,22,0.22)] transition-transform hover:-translate-y-0.5 hover:bg-orange-600 sm:w-auto"
              >
                Join CIRC <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/communities"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-primary/15 dark:border-white/15 bg-white dark:bg-[#141416] px-7 py-3 font-body text-sm font-semibold text-primary dark:text-white transition-colors hover:border-primary/40 dark:hover:border-white/40 hover:bg-surface-2 dark:hover:bg-[#1E1E24] sm:w-auto"
              >
                Explore Communities
              </Link>
            </div>

            {/* Keep statistics stable during first paint to prevent layout shifts. */}
            <div className="mt-8 grid max-w-[33rem] grid-cols-2 gap-3 rounded-[1.5rem] border border-primary/10 dark:border-white/10 bg-white/80 dark:bg-[#141416]/90 p-3 shadow-[0_18px_45px_rgba(15,36,96,0.06)] dark:shadow-[0_18px_45px_rgba(0,0,0,0.6)] backdrop-blur-sm">
              {STATS.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-primary/5 dark:border-white/5 bg-[#f9fafb] dark:bg-[#18181B] px-4 py-4 text-left">
                  <div className="flex items-end gap-1 font-display text-3xl font-bold tracking-tight text-primary dark:text-white sm:text-4xl">
                    <span className="tabular-nums">{metric.value}</span>
                    {metric.suffix && (
                      <span className="pb-1 text-2xl text-primary/80 dark:text-gray-300 sm:text-3xl">{metric.suffix}</span>
                    )}
                  </div>
                  <span className="mt-1 block font-body text-[9px] font-semibold uppercase tracking-[0.18em] text-muted dark:text-gray-400 sm:text-[10px]">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex items-center gap-2 font-body text-[10px] font-medium uppercase tracking-[0.16em] text-primary/65 dark:text-gray-400 sm:text-xs">
              <MapPin size={14} className="text-accent-orange" />
              Mutomo · Gatundu South · Kiambu County
            </div>
          </div>

          {/* Right: 3D circular fan deck */}
          <div className="relative flex items-center justify-center">
            {/* Watermark */}
            <div
              className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none text-center font-display font-black leading-none tracking-[-0.09em] text-primary/[0.07] dark:text-white/[0.05]"
              aria-hidden="true"
              style={{ fontSize: "clamp(8rem,17vw,20rem)" }}
            >
              CIRC
            </div>
            <div className="relative z-10">
              <CircularDeck slides={HARDCODED_SLIDES} />
            </div>
          </div>

        </div>
      </div>

      {/* Scroll caret */}
      <a
        href="#circ-about-heading"
        aria-label="Scroll to learn about CIRC"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 text-primary/35 transition-colors hover:text-accent-orange lg:block"
      >
        <ChevronDown size={20} />
      </a>
    </section>
  )
}
