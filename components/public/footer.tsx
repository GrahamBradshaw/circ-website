import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { getPublicCached } from "@/lib/redis-cache"
import { Github, Twitter, Instagram, Linkedin, MapPin, ExternalLink } from "lucide-react"
import { FALLBACK_COMMUNITIES } from "@/lib/public-fallbacks"

export async function Footer() {
  const settings = await getPublicCached("settings:singleton", () => prisma.settings.findUnique({
    where: { id: "singleton" },
  }), null)

  const communities = await getPublicCached("footer:communities", () => prisma.community.findMany({
    select: { name: true, slug: true },
    take: 6,
  }), FALLBACK_COMMUNITIES.slice(0, 6))

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Communities", href: "/communities" },
    { name: "Events", href: "/events" },
    { name: "Team", href: "/team" },
    { name: "Gallery", href: "/gallery" },
    { name: "Join", href: "/join" },
  ]

  return (
    <footer
      className="w-full bg-[#070708] border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Column 1 — Brand */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-shrink-0" style={{ width: "56px", height: "36px" }}>
              <Image
                src="/logos/circ-logo-dark.gif"
                alt="CIRC Logo — Computing Innovation & Research Club"
                fill
                unoptimized
                className="object-contain"
                sizes="56px"
              />
            </div>
            <span className="font-display text-white text-xl font-bold">CIRC</span>
          </div>
          <p className="font-body italic text-[#38BDF8] text-sm mt-3 leading-relaxed">
            &ldquo;Inspiring Innovation, Driving Progress and Creating a Brighter Future.&rdquo;
          </p>
          <p className="font-body text-white/40 text-xs mt-2 leading-relaxed">
            {settings?.aboutText || "Computing Innovation and Research Club — Mama Ngina University College."}
          </p>
          <div className="mt-4 pt-3 border-t border-white/10">
            <a
              href="https://share.google/5NucqVDcuhPzsBwSS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-2 font-body text-xs text-white/60 hover:text-accent-sky transition-colors group leading-relaxed"
              title="View Computing Innovation & Research Club on Google Maps"
            >
              <MapPin size={15} className="text-accent-orange flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <span>
                Computing Innovation &amp; Research Club · Off Mutomo, Thangari Rd, Gatundu
                <span className="block text-[11px] text-accent-sky group-hover:underline mt-0.5 font-medium flex items-center gap-1">
                  Open full Google Maps <ExternalLink size={11} />
                </span>
              </span>
            </a>

            {/* Embedded Mini-Map for immediate visual confirmation */}
            <div className="mt-3 relative w-full h-28 rounded-xl overflow-hidden border border-white/10 shadow-inner group">
              <iframe
                title="Computing Innovation & Research Club Map Location"
                src="https://maps.google.com/maps?q=-1.037054,36.923318&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 pointer-events-none filter contrast-[1.1] invert-[0.9] hue-rotate-[180deg] opacity-75 group-hover:opacity-100 transition-opacity"
                loading="lazy"
              />
              <a
                href="https://share.google/5NucqVDcuhPzsBwSS"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-transparent flex items-end p-2"
                aria-label="Open location in Google Maps"
              >
                <span className="text-[10px] font-mono font-medium text-white/90 bg-black/75 px-2 py-0.5 rounded backdrop-blur-sm">
                  Click to explore map
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Column 2 — Navigation */}
        <div>
          <p className="font-mono text-[#38BDF8] text-[9px] tracking-widest uppercase mb-4">
            NAVIGATION
          </p>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-white/40 text-sm hover:text-white/80 transition-colors block mb-2"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-5 pt-4 border-t border-white/10">
            <Link href="/privacy" className="font-body text-white/30 text-xs hover:text-white/70 transition-colors">Privacy</Link>
            <Link href="/terms" className="font-body text-white/30 text-xs hover:text-white/70 transition-colors">Terms</Link>
            <Link href="/cookies" className="font-body text-white/30 text-xs hover:text-white/70 transition-colors">Cookies</Link>
            <Link href="/ai-attribution" className="font-body text-white/30 text-xs hover:text-white/70 transition-colors">Attribution Policy</Link>
          </div>
        </div>

        {/* Column 3 — Communities */}
        <div>
          <p className="font-mono text-[#38BDF8] text-[9px] tracking-widest uppercase mb-4">
            OUR HUBS
          </p>
          {communities.map((c) => (
            <Link
              key={c.slug}
              href={`/communities/${c.slug}`}
              className="font-body text-white/40 text-sm hover:text-white/80 transition-colors block mb-2"
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Column 4 — Connect */}
        <div>
          <p className="font-mono text-[#38BDF8] text-[9px] tracking-widest uppercase mb-4">
            GET IN TOUCH
          </p>
          <p className="font-body text-white/40 text-sm mb-4">
            {settings?.contactEmail || "circ@mnu.ac.ke"}
          </p>
          <div className="flex items-center gap-3 mt-3">
            {[
              { href: settings?.github || "#", Icon: Github, label: "GitHub" },
              { href: settings?.twitter || "#", Icon: Twitter, label: "Twitter" },
              { href: settings?.instagram || "#", Icon: Instagram, label: "Instagram" },
              { href: settings?.linkedin || "#", Icon: Linkedin, label: "LinkedIn" },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 transition-colors"
                style={{
                  background: "rgba(56,189,248,0.05)",
                  border: "1px solid rgba(56,189,248,0.1)",
                }}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="max-w-7xl mx-auto px-6 mt-0 pb-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderTop: "1px solid rgba(56,189,248,0.06)", paddingTop: "1.5rem" }}
      >
        <span className="font-mono text-[9px] tracking-widest text-white/20">
          © {new Date().getFullYear()} CIRC — MAMA NGINA UNIVERSITY COLLEGE
        </span>
        <span className="font-mono text-[9px] tracking-widest text-white/40">
          Official website of CIRC MNUC
        </span>
        <span className="font-mono text-[9px] tracking-widest text-white/20">
          AY 2025/26 // ALL RIGHTS RESERVED
        </span>
      </div>
    </footer>
  )
}
