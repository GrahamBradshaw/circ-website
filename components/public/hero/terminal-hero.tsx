import Link from "next/link"
import { ArrowRight, ChevronDown, MapPin } from "lucide-react"
import { CircularDeck } from "@/components/public/hero/circular-deck"

// ─── Hardcoded Hero Images (5 unique photos, no duplicates) ───────────────────

const HERO_SLIDES = [
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

// ─── TerminalHero (Page Hero Section) ─────────────────────────────────────────

export function TerminalHero() {
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
              <CircularDeck slides={HERO_SLIDES} />
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
