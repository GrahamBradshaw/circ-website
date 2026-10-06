import { MapPin, Navigation, ExternalLink } from "lucide-react"

export function LocationMapSection({ tone = "white" }: { tone?: "white" | "tinted" }) {
  const latitude = -1.037054
  const longitude = 36.923318
  const mapEmbedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=17&ie=UTF8&iwloc=&output=embed`
  const mapsDirectUrl = "https://share.google/5NucqVDcuhPzsBwSS"

  const sectionTone =
    tone === "tinted"
      ? "bg-surface-2 dark:bg-[#09090B]"
      : "bg-white dark:bg-[#121215]"

  return (
    <section className={`relative overflow-hidden ${sectionTone} py-20 border-b border-black/5 dark:border-white/10 transition-colors`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-orange">
              <span className="h-px w-6 bg-accent-orange" /> Club Location
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary dark:text-white sm:text-4xl">
              Computing Innovation &amp; Research Club
            </h2>
            <p className="mt-2 font-body text-sm sm:text-base text-muted dark:text-gray-400">
              Off Mutomo, Thangari Rd, Gatundu
            </p>
          </div>

          <a
            href={mapsDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent-orange px-5 py-2.5 font-body text-xs font-semibold text-white shadow-sm transition-all hover:bg-orange-600 hover:-translate-y-0.5 active:scale-95 flex-shrink-0 w-fit"
          >
            <Navigation size={14} />
            <span>Open in Google Maps</span>
            <ExternalLink size={12} className="opacity-75" />
          </a>
        </div>

        {/* Responsive Map Container with dark mode styling border and shadow */}
        <div className="relative w-full overflow-hidden rounded-3xl border border-primary/10 dark:border-white/15 bg-surface-2 dark:bg-[#18181C] shadow-[0_12px_40px_rgba(15,36,96,0.06)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.7)]">
          <div className="relative h-[360px] sm:h-[440px] md:h-[480px] w-full">
            <iframe
              title="Computing Innovation & Research Club exact location"
              src={mapEmbedUrl}
              className="absolute inset-0 h-full w-full border-0 filter saturate-[1.1] dark:contrast-[1.1] dark:invert-[0.9] dark:hue-rotate-[180deg]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          {/* Location details card floating at bottom */}
          <div className="border-t border-primary/10 dark:border-white/10 bg-white/95 dark:bg-[#141416]/95 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent-orange/10 text-accent-orange flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin size={18} />
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-primary dark:text-white">
                  Computing Innovation &amp; Research Club
                </p>
                <p className="font-body text-xs text-muted dark:text-gray-400">
                  Off Mutomo, Thangari Rd, Gatundu
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-muted dark:text-gray-400">
                -1.037054, 36.923318
              </span>
              <a
                href={mapsDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-xs font-semibold text-accent-orange hover:underline inline-flex items-center gap-1"
              >
                Get Directions <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
