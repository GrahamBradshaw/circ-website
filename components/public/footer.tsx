import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { getPublicCached } from "@/lib/redis-cache"
import { Github, Twitter, Instagram, Linkedin } from "lucide-react"
import { FALLBACK_COMMUNITIES } from "@/lib/public-fallbacks"
import { SITE_URL } from "@/lib/seo"
import { getSocialProfiles } from "@/lib/social-links"

export async function Footer() {
  const [settings, databaseCommunities] = await Promise.all([
    getPublicCached("settings:singleton", () => prisma.settings.findUnique({
      where: { id: "singleton" },
    }), null),
    getPublicCached("footer:communities", () => prisma.community.findMany({
      select: { name: true, slug: true },
    }), FALLBACK_COMMUNITIES),
  ])
  const communities = [...new Map(
    [...FALLBACK_COMMUNITIES, ...databaseCommunities].map((community) => [community.slug, community]),
  ).values()]
  const socialProfiles = getSocialProfiles(settings)
  const socialLinks = socialProfiles.map((profile) => ({
    ...profile,
    Icon: profile.platform === "GitHub" ? Github
      : profile.platform === "X" ? Twitter
        : profile.platform === "Instagram" ? Instagram : Linkedin,
  }))

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Club History", href: "/history" },
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
      {socialProfiles.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              sameAs: socialProfiles,
            }).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Column 1: Brand */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-shrink-0" style={{ width: "56px", height: "36px" }}>
              <Image
                src="/logos/circ-logo-dark.webp"
                alt="CIRC logo for the Computing Innovation and Research Club"
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
            {settings?.aboutText || "Computing Innovation and Research Club at Mama Ngina University College."}
          </p>
        </div>

        {/* Column 2: Navigation */}
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

        {/* Column 3: Communities */}
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

        {/* Column 4: Connect */}
        <div>
          <p className="font-mono text-[#38BDF8] text-[9px] tracking-widest uppercase mb-4">
            GET IN TOUCH
          </p>
          <p className="font-body text-white/40 text-sm mb-4">
            {settings?.contactEmail || "circ@mnu.ac.ke"}
          </p>
          <div className="flex items-center gap-3 mt-3">
            {socialLinks.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow CIRC on ${label}`}
                title={label}
              className="min-h-8 rounded-lg flex items-center gap-2 px-2.5 text-white/50 hover:text-white/90 transition-colors"
                style={{
                  background: "rgba(56,189,248,0.05)",
                  border: "1px solid rgba(56,189,248,0.1)",
                }}
              >
                <Icon size={14} />
                <span className="font-body text-xs">{label}</span>
              </a>
            ))}
          </div>
          {socialLinks.length > 0 && (
            <Link href="/socials" className="mt-3 inline-block font-body text-xs text-white/50 hover:text-white transition-colors">
              All CIRC social profiles
            </Link>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="max-w-7xl mx-auto px-6 mt-0 pb-6 flex items-center justify-center"
        style={{ borderTop: "1px solid rgba(56,189,248,0.06)", paddingTop: "1.5rem" }}
      >
        <span className="font-body text-xs text-white/40">
          © {new Date().getFullYear()} CIRC MNUC. All rights reserved.
        </span>
      </div>
    </footer>
  )
}
