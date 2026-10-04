import { prisma } from "@/lib/prisma"
import { getPublicCached } from "@/lib/redis-cache"
import { getSocialProfiles } from "@/lib/social-links"
import { createPageMetadata, SITE_URL } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "CIRC MNUC Instagram and Social Media Profiles",
  description: "Find the Computing Innovation and Research Club’s official Instagram profile and other social media links at Mama Ngina University College.",
  path: "/socials",
  keywords: ["CIRC MNUC socials", "CIRC social media", "Computing Innovation and Research Club Instagram", "CIRC Instagram @circ_mnu", "CIRC LinkedIn", "CIRC GitHub"],
})

export default async function SocialsPage() {
  const settings = await getPublicCached(
    "socials:settings",
    () => prisma.settings.findUnique({
      where: { id: "singleton" },
      select: { github: true, twitter: true, instagram: true, linkedin: true },
    }),
    null,
  )
  const profiles = getSocialProfiles(settings)
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/socials#webpage`,
    url: `${SITE_URL}/socials`,
    name: "Official CIRC MNUC Social Media Profiles",
    about: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Computing Innovation and Research Club (CIRC MNUC)",
      sameAs: profiles.map(({ href }) => href),
    },
  }

  return (
    <section className="min-h-[55vh] bg-surface-2 px-5 py-16 dark:bg-[#09090B] sm:px-8 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-orange">Stay connected</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-primary dark:text-white sm:text-5xl">
          CIRC social media profiles
        </h1>
        <p className="mt-5 max-w-2xl font-body text-base leading-7 text-muted dark:text-gray-300">
          Follow the Computing Innovation and Research Club at Mama Ngina University College for club news, community activities, events, and projects.
        </p>

        {profiles.length > 0 ? (
          <nav aria-label="Official CIRC social media profiles" className="mt-10 grid gap-3 sm:grid-cols-2">
            {profiles.map(({ platform, label, href }) => (
              <a
                key={platform}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-primary/10 bg-white p-5 font-body text-primary transition hover:border-primary/30 hover:shadow-md dark:border-white/10 dark:bg-[#121214] dark:text-white"
              >
                <span className="block text-lg font-semibold">CIRC on {label}</span>
                <span className="mt-1 block break-all text-sm text-muted dark:text-gray-400">{href}</span>
              </a>
            ))}
          </nav>
        ) : (
          <p className="mt-8 rounded-xl border border-primary/10 bg-white p-5 font-body text-sm text-muted dark:border-white/10 dark:bg-[#121214] dark:text-gray-300">
            CIRC’s official social profile links will appear here when configured.
          </p>
        )}
      </div>
    </section>
  )
}
