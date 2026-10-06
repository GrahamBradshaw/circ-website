import { prisma } from "@/lib/prisma"
import { getPublicCached } from "@/lib/redis-cache"
import { TerminalHero } from "@/components/public/hero/terminal-hero"
import { CommunitiesSection } from "@/components/public/communities/communities-section"
import { EventsStrip } from "@/components/public/events/events-strip"
import { LeadershipTeaser } from "@/components/public/team/leadership-teaser"
import { LocationMapSection } from "@/components/public/location-map"
import { JoinCTA } from "@/components/public/home/join-cta"
import { TestimonialsSection } from "@/components/public/testimonials/testimonials-section"
import { Suspense } from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { UnauthorizedToast } from "@/components/public/unauthorized-toast"
import { createPageMetadata, SITE_URL } from "@/lib/seo"
import { FALLBACK_COMMUNITIES } from "@/lib/public-fallbacks"
import { getSocialProfiles } from "@/lib/social-links"
import { formatRole } from "@/lib/utils"

export const metadata = createPageMetadata({
  title: "Computing Innovation and Research Club | CIRC at Mama Ngina University College",
  description: "Computing Innovation and Research Club (CIRC MNUC) at Mama Ngina University College in Mutomo, Gatundu South, Kiambu County, Kenya — student technology, research, software, AI, data science, and innovation community near Thika Road and connected to Kenyatta University.",
  path: "/",
  keywords: ["computing innovation and research club", "CIRC", "CIRC MNUC", "CIRC MNU", "Mama Ngina University", "MNU", "MNUC", "Computer Science", "computer science club mama ngina", "computer science club mnu", "Computer Science MNU", "SPAS", "School of Pure and Applied Sciences", "software development", "AI and machine learning", "data science", "cybersecurity", "Web3", "Internet of Things", "student technology club Kenya"],
})

export const revalidate = 300

// Placeholder member quotes for the testimonials section — edit freely.
const TESTIMONIAL_QUOTES = [
  "CIRC turned my classroom theory into real projects. I walked in knowing Python basics and walked out shipping full web apps with a team.",
  "The workshops and hackathons pushed me further in one semester than I thought possible. Everyone here genuinely wants you to grow.",
  "I joined for the coding community and stayed for the people. CIRC is where I found my team for final-year projects and beyond.",
  "From AI/ML sessions to Web3 explorations, there is always something new to build. The community leads actually listen and help.",
  "Being part of CIRC at Mama Ngina University College gave me leadership experience, a strong portfolio, and friends who code as hard as I do.",
]

export default async function HomePage() {
  const [communities, upcomingEvents, execs, settings] = await Promise.all([
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
    getPublicCached("home:social-profiles", () => prisma.settings.findUnique({
      where: { id: "singleton" },
      select: { github: true, twitter: true, instagram: true, linkedin: true },
    }), null),
  ])
  const socialProfiles = getSocialProfiles(settings)

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "CIRC MNUC",
    alternateName: ["Computing Innovation and Research Club", "CIRC", "CIRC MNU", "Computer Science MNU"],
    url: `${SITE_URL}/`,
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-KE",
  }
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Computing Innovation and Research Club (CIRC MNUC)",
    alternateName: ["CIRC MNUC", "CIRC MNU", "CIRC", "Computer Science Club", "Computer Science MNU", "Computer Science Club Mama Ngina", "MNUC Computer Science Club"],
    url: SITE_URL,
    sameAs: socialProfiles.map(({ href }) => href),
  }
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the Computing Innovation and Research Club (CIRC)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Computing Innovation and Research Club (CIRC, also known as CIRC MNUC and CIRC MNU) is a student-led computing, innovation and research club at Mama Ngina University College (MNUC, commonly called Mama Ngina University or MNU), a constituent college of Kenyatta University in Mutomo, Gatundu South, Kiambu County, Kenya. It brings students together through 7 technology communities, workshops, events, and collaborative projects.",
        },
      },
      {
        "@type": "Question",
        name: "Is CIRC the Computer Science Club at Mama Ngina University?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. CIRC was formerly the Computer Science Club (Computer Science MNU) at Mama Ngina University College. It was founded on 20 January 2022 and rebranded to the Computing Innovation and Research Club in March 2026, keeping its members, leadership legacy, and three consecutive Best Club Awards.",
        },
      },
      {
        "@type": "Question",
        name: "Who can join CIRC at Mama Ngina University College?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Students in relevant programmes at the School of Pure and Applied Sciences (SPAS) — including Computer Science, Information Technology, Mathematics and Computer Science, and Statistics and Programming — can apply, alongside the wider MNUC student community. Applications are submitted on the CIRC website and reviewed on a rolling basis.",
        },
      },
      {
        "@type": "Question",
        name: "What communities are in CIRC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CIRC has 7 communities: Programming, AI and Machine Learning, Data Science and Modelling, Internet of Things, Web Development, Web3 and Blockchain, and Networking and Cybersecurity. Each community runs its own workshops, projects, and events.",
        },
      },
      {
        "@type": "Question",
        name: "Where is CIRC located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CIRC is based at Mama Ngina University College, Off Mutomo, Thangari Road, Gatundu South, Kiambu County, Kenya (coordinates -1.037054, 36.923318). The club can be contacted at circ@mnu.ac.ke.",
        },
      },
      {
        "@type": "Question",
        name: "How do I contact or join CIRC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Apply via the join page at https://www.circ.co.ke/join, email circ@mnu.ac.ke, or use the contact page at https://www.circ.co.ke/contact. CIRC is open to collaborations and partnerships.",
        },
      },
    ],
  }

  return (
    <div className="circ-home-design flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData).replace(/</g, "\\u003c") }}
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
                CIRC (Computing Innovation and Research Club) is a student club at <a className="font-medium text-primary dark:text-accent-sky underline decoration-accent-sky decoration-2 underline-offset-4 hover:text-accent-orange" href="https://mnu.ac.ke/" target="_blank" rel="noreferrer">Mama Ngina University College (MNUC)</a>, commonly referred to as Mama Ngina University or MNU. It is a constituent college of <a className="font-medium text-primary dark:text-accent-sky underline decoration-accent-sky decoration-2 underline-offset-4 hover:text-accent-orange" href="https://www.ku.ac.ke/ku-history-profile/" target="_blank" rel="noreferrer">Kenyatta University</a>, located in <a className="font-medium text-primary dark:text-accent-sky underline decoration-accent-sky decoration-2 underline-offset-4 hover:text-accent-orange inline-flex items-center gap-1" href="https://share.google/5NucqVDcuhPzsBwSS" target="_blank" rel="noreferrer">Mutomo, Gatundu South, Kiambu County, Kenya <ExternalLink size={12} className="inline" /></a>. Formerly known as the <Link href="/history" className="font-medium text-primary dark:text-accent-sky underline decoration-accent-sky decoration-2 underline-offset-4 hover:text-accent-orange">Computer Science Club</Link>, CIRC brings students together through <Link href="/communities" className="font-medium text-primary dark:text-accent-sky underline decoration-accent-sky decoration-2 underline-offset-4 hover:text-accent-orange">7 specialized communities</Link>, <Link href="/events" className="font-medium text-primary dark:text-accent-sky underline decoration-accent-sky decoration-2 underline-offset-4 hover:text-accent-orange">workshops &amp; events</Link>, and <Link href="/gallery" className="font-medium text-primary dark:text-accent-sky underline decoration-accent-sky decoration-2 underline-offset-4 hover:text-accent-orange">collaborative projects</Link> to build practical computing skills and explore technology and research.
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
                CIRC activities cover web and software development, programming, artificial intelligence and machine learning, data science, cybersecurity, Web3 and the Internet of Things (<Link href="/communities" className="font-medium text-primary dark:text-accent-sky underline decoration-accent-sky decoration-2 underline-offset-4 hover:text-accent-orange">explore our communities</Link>). Students in relevant programmes at the <a className="font-medium text-primary dark:text-accent-sky underline decoration-accent-sky decoration-2 underline-offset-4 hover:text-accent-orange" href="https://spas.mnu.ac.ke/" target="_blank" rel="noreferrer">School of Pure and Applied Sciences (SPAS)</a>, including Computer Science, Information Technology, Mathematics and Computer Science, and Statistics and Programming, can <Link href="/join" className="font-semibold text-accent-orange underline decoration-accent-orange decoration-2 underline-offset-4 hover:text-orange-600">apply to join the club</Link> alongside the wider MNUC student community.
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

      {/* Section E2: Testimonials (pair-cycling animation) */}
      <TestimonialsSection
        items={execs.map((member, index) => ({
          name: member.name,
          role: formatRole(member.role),
          quote: TESTIMONIAL_QUOTES[index % TESTIMONIAL_QUOTES.length],
          photo: member.photo,
        }))}
      />

      {/* Section F: Join CTA */}
      <JoinCTA />
    </div>
  )
}
