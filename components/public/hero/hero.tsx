// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import Link from "next/link"

// This function Hero handles the main work in this file and explains what this logic is doing in simple English.
export function Hero() {
  const STATS = [
    { value: "120+", label: "Members" },
    { value: "6", label: "Communities" },
    { value: "24+", label: "Events Run" },
    { value: "30+", label: "Projects Built" },
  ]

  return (
    <section className="relative w-full overflow-hidden" style={{ background: "linear-gradient(160deg, #0F2460 0%, #1E3A8A 100%)" }}>
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 sm:pt-36 sm:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

        {/* Left: copy + CTAs */}
        <div className="text-center lg:text-left">
          <div
            className="inline-flex items-center gap-2 mb-6"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: "20px",
              padding: "6px 16px",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green flex-shrink-0" />
            <span className="font-body text-white/80 text-xs font-medium tracking-wide">
              Applications open for AY 2026/27
            </span>
          </div>

          <h1 className="font-display text-white font-bold leading-tight text-4xl sm:text-5xl lg:text-[3.25rem]">
            Empowering Students Through Computing Innovation and Research
          </h1>
          <p className="font-body text-white/70 text-lg leading-relaxed mt-5 max-w-xl mx-auto lg:mx-0">
            The Computing Innovation &amp; Research Club at Mama Ngina University College - where students
            build practical skills in software, data, and emerging technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mt-10">
            <Link href="/join" className="btn-primary-lg flex items-center gap-2 group">
              Join CIRC
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/communities" className="btn-outline-white flex items-center gap-2">
              Explore Communities
            </Link>
          </div>
        </div>

        {/* Right: stat panel */}
        <div className="relative">
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
              backdropFilter: "blur(6px)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-body text-white/60 text-xs uppercase tracking-wide">Club Snapshot</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                <span className="font-body text-white/60 text-xs">Live</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl p-5"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <div className="font-display font-bold text-white text-3xl">{stat.value}</div>
                  <div className="font-body text-white/55 text-xs uppercase tracking-wide mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-4 rounded-xl p-4 flex items-center justify-between"
              style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)" }}
            >
              <span className="font-body text-white/80 text-sm">Registration for 2027 intake</span>
              <span className="font-body text-accent-orange text-sm font-semibold">Open</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
