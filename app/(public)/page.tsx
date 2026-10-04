import { prisma } from "@/lib/prisma"
import { getPublicCached } from "@/lib/redis-cache"
import { TerminalHero } from "@/components/public/hero/terminal-hero"
import { CommunitiesSection } from "@/components/public/communities/communities-section"
import { EventsStrip } from "@/components/public/events/events-strip"
import { LeadershipTeaser } from "@/components/public/team/leadership-teaser"
import { LocationMapSection } from "@/components/public/location-map"
import { JoinCTA } from "@/components/public/home/join-cta"
import { Suspense } from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { UnauthorizedToast } from "@/components/public/unauthorized-toast"
import { createPageMetadata, SITE_URL } from "@/lib/seo"
import { FALLBACK_COMMUNITIES } from "@/lib/public-fallbacks"

export const metadata = createPageMetadata({
  title: "Computing Innovation and Research Club (CIRC MNUC) at Mama Ngina University College",
  description: "CIRC MNUC is the Computing Innovation and Research Club at Mama Ngina University College, along Thangari Road in Mutomo, Gatundu South, Kiambu County, Kenya.",
  path: "/",
  keywords: ["Mama Ngina University", "MNU", "MNUC", "SPAS", "School of Pure and Applied Sciences", "software development", "AI and machine learning", "data science", "cybersecurity", "Web3", "Internet of Things", "student technology club Kenya"],
})

export const revalidate = 300

export default async function HomePage() {
  const [communities, upcomingEvents, execs] = await Promise.all([
    getPublicCached("home:communities", () => prisma.community.findMany(), FALLBACK_COMMUNITIES),
    getPublicCached("home:upcoming-events", () => prisma.event.findMany({
      where: {
        published: true,
        date: { gte: new Date() },
      },
      orderBy: { date: "asc" },
      take: 3,
    }), []),
    getPublicCached("home:executives", () => prisma.teamMember.findMany({
      where: {
        role: { in: ["CHAIRPERSON", "VICE_CHAIRPERSON", "SECRETARY", "TREASURER", "EVENT_ORGANIZER"] as any },
      },
      orderBy: { displayOrder: "asc" },
    }), []),
  ])

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
    ],
  }

  return (
    <div className="circ-home-design flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData).replace(/</g, "\\u003c") }}
      />
      <Suspense><UnauthorizedToast /></Suspense>
      <TerminalHero />

      <section
        className="relative overflow-hidden bg-white dark:bg-[#121215] py-24 md:py-32 border-y border-black/5 dark:border-white/10 transition-colors"
        aria-labelledby="circ-about-heading"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 dark:via-white/15 to-transparent"
        />
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28">
            <p className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-orange">
              <span className="h-px w-7 bg-accent-orange" /> Who we are
            </p>
            <h2 id="circ-about-heading" className="mt-5 max-w-lg font-display text-5xl font-bold leading-[0.94] tracking-[-0.06em] text-primary dark:text-white md:text-6xl transition-colors">
              About <span className="text-accent-orange">CIRC.</span>
            </h2>
            <p className="mt-6 max-w-sm font-body text-lg leading-relaxed text-muted dark:text-gray-400 transition-colors">
              A student club for computing, technology and research at MNUC.
            </p>
            <div className="mt-8 h-1 w-16 rounded-full bg-accent-orange" />
            <p className="mt-6 max-w-sm font-body text-base leading-relaxed text-main dark:text-gray-200 transition-colors">
              A place for students to learn together, grow practical skills, and turn curiosity into meaningful work.
            </p>
          </div>

          <div className="divide-y divide-primary/10 dark:divide-white/10 border-y border-primary/10 dark:border-white/10">
            <article className="grid gap-5 py-8 md:grid-cols-[4rem_1fr] md:gap-7 md:py-10">
              <span className="font-mono text-xs tracking-widest text-accent-orange">01</span>
              <div>
                <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted dark:text-gray-400">Our community</p>
                <h3 className="mb-4 font-display text-2xl font-bold tracking-tight text-primary dark:text-white md:text-3xl">Learn, build, and explore together</h3>
                <p className="font-body text-base leading-8 text-main dark:text-gray-200">
                CIRC (Computing Innovation and Research Club) is a student club at <a className="font-medium text-primary dark:text-accent-sky underline decoration-accent-sky decoration-2 underline-offset-4 hover:text-accent-orange" href="https://mnu.ac.ke/" target="_blank" rel="noreferrer">Mama Ngina University College (MNUC)</a>, commonly referred to as Mama Ngina University or MNU. It is a constituent college of <a className="font-medium text-primary dark:text-accent-sky underline decoration-accent-sky decoration-2 underline-offset-4 hover:text-accent-orange" href="https://www.ku.ac.ke/ku-history-profile/" target="_blank" rel="noreferrer">Kenyatta University</a>, located in <a className="font-medium text-primary dark:text-accent-sky underline decoration-accent-sky decoration-2 underline-offset-4 hover:text-accent-orange inline-flex items-center gap-1" href="https://share.google/5NucqVDcuhPzsBwSS" target="_blank" rel="noreferrer">Mutomo, Gatundu South, Kiambu County, Kenya <ExternalLink size={12} className="inline" /></a>. Formerly known as the Computer Science Club, CIRC brings students together through <Link href="/communities" className="font-medium text-primary dark:text-accent-sky underline decoration-accent-sky decoration-2 underline-offset-4 hover:text-accent-orange">7 specialized communities</Link>, <Link href="/events" className="font-medium text-primary dark:text-accent-sky underline decoration-accent-sky decoration-2 underline-offset-4 hover:text-accent-orange">workshops &amp; events</Link>, and <Link href="/gallery" className="font-medium text-primary dark:text-accent-sky underline decoration-accent-sky decoration-2 underline-offset-4 hover:text-accent-orange">collaborative projects</Link> to build practical computing skills and explore technology and research.
                </p>
                <Link href="/history" className="mt-4 inline-flex font-medium text-accent-orange underline decoration-accent-orange underline-offset-4 hover:text-orange-600">Read the history of CIRC MNUC</Link>
              </div>
            </article>

            <article className="grid gap-5 py-8 md:grid-cols-[4rem_1fr] md:gap-7 md:py-10">
              <span className="font-mono text-xs tracking-widest text-accent-orange">02</span>
              <div>
                <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted dark:text-gray-400">What we explore</p>
                <h3 className="mb-4 font-display text-2xl font-bold tracking-tight text-primary dark:text-white md:text-3xl">Computing across disciplines</h3>
                <p className="font-body text-base leading-8 text-main dark:text-gray-200">
                CIRC activities cover web and software development, programming, artificial intelligence and machine learning, data science, cybersecurity, Web3 and the Internet of Things (<Link href="/communities" className="font-medium text-primary dark:text-accent-sky underline decoration-accent-sky decoration-2 underline-offset-4 hover:text-accent-orange">explore our communities</Link>). Students in relevant programmes at the <a className="font-medium text-primary dark:text-accent-sky underline decoration-accent-sky decoration-2 underline-offset-4 hover:text-accent-orange" href="https://spas.mnu.ac.ke/" target="_blank" rel="noreferrer">School of Pure and Applied Sciences (SPAS)</a>—including Computer Science, Information Technology, Mathematics and Computer Science, and Statistics and Programming—can <Link href="/join" className="font-semibold text-accent-orange underline decoration-accent-orange decoration-2 underline-offset-4 hover:text-orange-600">apply to join the club</Link> alongside the wider MNUC student community.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Section B: Communities */}
      <CommunitiesSection communities={communities} />

      {/* Section C: Events */}
      <EventsStrip events={upcomingEvents} />

      {/* Section D: Leadership */}
      <LeadershipTeaser members={execs} />

      {/* Section E: Location Map */}
      <LocationMapSection />

      {/* Section F: Join CTA */}
      <JoinCTA />
    </div>
  )
}
