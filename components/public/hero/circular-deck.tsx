"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

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

export function CircularDeck({ slides }: { slides: string[] }) {
  const N = slides.length
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const rotObj = useRef({ val: 0 })
  const gsapRef = useRef<typeof import("gsap").gsap | null>(null)
  const activeDotRef = useRef(0)
  const tweenRef = useRef<{ kill: () => void } | null>(null)
  const [activeDot, setActiveDot] = useState(0)

  // Render cards at a specific continuous rotation value
  const applyRotation = (currentRot: number, currentVw: number) => {
    const gsap = gsapRef.current
    if (N === 0 || !gsap) return

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

      // Update the costly shadow only when a card enters or leaves the center.
      const isCenter = state.isCenter ? "true" : "false"
      if (el.dataset.center !== isCenter) {
        el.dataset.center = isCenter
        el.style.boxShadow = state.isCenter
          ? "0 30px 60px -15px rgba(15, 36, 96, 0.35), 0 0 0 1.5px rgba(255, 255, 255, 0.6)"
          : "0 15px 35px -10px rgba(0, 0, 0, 0.25)"
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
    const gsap = gsapRef.current
    if (!gsap || N === 0) return
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

  // Position slides once, and recalculate only when the viewport changes.
  useEffect(() => {
    const updatePositions = () => applyRotation(rotObj.current.val, window.innerWidth)
    let cancelled = false
    void import("gsap").then(({ gsap }) => {
      if (cancelled) return
      gsapRef.current = gsap
      updatePositions()
      window.addEventListener("resize", updatePositions, { passive: true })
    })
    return () => {
      cancelled = true
      window.removeEventListener("resize", updatePositions)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Avoid spending animation work while the tab is hidden or motion is reduced.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let timer: number | undefined
    const start = () => {
      if (timer === undefined && !document.hidden) {
        timer = window.setInterval(() => rotateTo(rotObj.current.val + 1), 3500)
      }
    }
    const stop = () => {
      if (timer !== undefined) {
        window.clearInterval(timer)
        timer = undefined
      }
    }
    const onVisibilityChange = () => document.hidden ? stop() : start()

    start()
    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => {
      stop()
      document.removeEventListener("visibilitychange", onVisibilityChange)
      tweenRef.current?.kill()
    }
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
              willChange: "transform",
            }}
          >
            <Image
              src={src}
              alt={`CIRC showcase photo ${i + 1}`}
              fill
              sizes="(max-width: 479px) 264px, (max-width: 767px) 304px, (max-width: 991px) 368px, 448px"
              quality={60}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "low"}
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

      {/* Slide indicators */}
      <div className="relative z-20 flex items-center justify-center">
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
      </div>
    </div>
  )
}
