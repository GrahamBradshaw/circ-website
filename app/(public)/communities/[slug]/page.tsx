import { prisma } from "@/lib/prisma"
import { getPublicCached } from "@/lib/redis-cache"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Github, Linkedin, Twitter, ArrowRight } from "lucide-react"
import { formatRole } from "@/lib/utils"
import { PageHero } from "@/components/public/page-hero"
import { createPageMetadata, plainTextDescription, SITE_URL } from "@/lib/seo"
import { FALLBACK_COMMUNITIES } from "@/lib/public-fallbacks"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const community = await getPublicCached(`community:metadata:${slug}`, () => prisma.community.findUnique({
    where: { slug },
    select: { name: true, description: true, focusTags: true },
  }), FALLBACK_COMMUNITIES.find((item) => item.slug === slug) ?? null)
  if (!community) return { title: "Community Not Found", robots: { index: false, follow: false } }

  return createPageMetadata({
    title: `${community.name} Community`,
    description: plainTextDescription(`${community.description} Join this CIRC technology community at Mama Ngina University College.`),
    path: `/communities/${encodeURIComponent(slug)}`,
    keywords: [...community.focusTags, `${community.name} community`, "MNUC technology community", "SPAS computing"],
  })
}

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  const community = await getPublicCached(`community:detail:${slug}`, () => prisma.community.findUnique({
    where: { slug },
    include: {
      lead: true,
      events: {
        where: { published: true },
        take: 3,
        orderBy: { date: "desc" },
      },
    },
  }), FALLBACK_COMMUNITIES.find((item) => item.slug === slug) ?? null)

  if (!community) {
    notFound()
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${community.name} Community | CIRC`,
    description: plainTextDescription(community.description),
    url: `${SITE_URL}/communities/${encodeURIComponent(slug)}`,
    about: {
      "@type": "Organization",
      name: `${community.name} Community`,
      description: plainTextDescription(community.description),
      parentOrganization: {
        "@type": "Organization",
        name: "Computing Innovation & Research Club (CIRC)",
        url: SITE_URL,
      },
      knowsAbout: community.focusTags,
    },
  }

  return (
    <div className="flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <PageHero
        badge={"COMMUNITY — " + community.name.toUpperCase()}
        title={community.name}
        subtitle={community.description}
        size="md"
      />

      {/* Content Section */}
      <section className="py-16 lg:py-24 bg-surface-2 dark:bg-[#09090B] transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Left: Description & Activities */}
            <div className="lg:col-span-2 space-y-12 bg-white dark:bg-[#121214] rounded-3xl p-8 sm:p-12 border border-primary/10 dark:border-white/10 shadow-[0_8px_30px_rgba(15,36,96,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
              <div className="space-y-6">
                <p className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-orange">
                  <span className="h-px w-6 bg-accent-orange" /> Focus Areas
                </p>
                <h2 className="font-display text-primary dark:text-white text-3xl sm:text-4xl font-bold tracking-tight">About the Community</h2>
                <p className="font-body text-main dark:text-gray-200 text-lg leading-relaxed">
                  {community.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {community.focusTags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium bg-primary/5 dark:bg-white/5 text-primary/80 dark:text-gray-300 border border-primary/10 dark:border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {community.activities && community.activities.length > 0 && (
                <div className="space-y-6 pt-6 border-t border-primary/10 dark:border-white/10">
                  <h3 className="font-display text-primary dark:text-white text-2xl font-bold">What We Do</h3>
                  <div className="space-y-4">
                    {community.activities.map((activity, i) => (
                      <div key={i} className="flex gap-4 items-start group">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent-orange mt-2 flex-shrink-0 group-hover:scale-125 transition-transform" />
                        <p className="font-body text-main dark:text-gray-200 font-medium text-base leading-relaxed">
                          {activity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-8">
              {/* Lead Card */}
              <div className="sticky top-24">
                <h2 className="font-mono text-accent-orange text-[10px] font-bold uppercase tracking-[.2em] mb-4">
                  Community Lead
                </h2>
                {community.lead ? (
                  <div className="bg-white dark:bg-[#121214] rounded-3xl border border-primary/10 dark:border-white/10 overflow-hidden shadow-[0_10px_30px_rgba(15,36,96,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-6 text-center flex flex-col items-center">
                    {/* Lead photo circle */}
                    <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-surface-2 dark:border-[#1E1E23] shadow-md mb-4 flex-shrink-0">
                      {community.lead.photo ? (
                        <Image
                          src={community.lead.photo}
                          alt={community.lead.name}
                          fill
                          sizes="112px"
                          className="object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-white font-display font-extrabold text-2xl">
                          {community.lead.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                      )}
                    </div>

                    <h3 className="font-display text-primary dark:text-white text-xl font-bold mb-1">{community.lead.name}</h3>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent-orange/10 text-accent-orange border border-accent-orange/20 mb-3">
                      {formatRole(community.lead.role)}
                    </span>
                    {community.lead.bio && (
                      <p className="font-body text-muted dark:text-gray-400 text-sm leading-relaxed mb-4">{community.lead.bio}</p>
                    )}
                    <div className="flex items-center justify-center gap-2">
                      {community.lead.linkedin && (
                        <a href={community.lead.linkedin} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full border border-primary/10 dark:border-white/10 bg-surface-2 dark:bg-[#1C1C20] flex items-center justify-center text-primary/70 dark:text-gray-300 hover:text-accent-orange hover:bg-white dark:hover:bg-[#25252B] transition-colors">
                          <Linkedin size={14} />
                        </a>
                      )}
                      {community.lead.github && (
                        <a href={community.lead.github} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full border border-primary/10 dark:border-white/10 bg-surface-2 dark:bg-[#1C1C20] flex items-center justify-center text-primary/70 dark:text-gray-300 hover:text-accent-orange hover:bg-white dark:hover:bg-[#25252B] transition-colors">
                          <Github size={14} />
                        </a>
                      )}
                      {community.lead.twitter && (
                        <a href={community.lead.twitter} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full border border-primary/10 dark:border-white/10 bg-surface-2 dark:bg-[#1C1C20] flex items-center justify-center text-primary/70 dark:text-gray-300 hover:text-accent-orange hover:bg-white dark:hover:bg-[#25252B] transition-colors">
                          <Twitter size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-[#121214] rounded-3xl p-8 border border-primary/10 dark:border-white/10 text-center shadow-sm">
                    <p className="font-body text-muted dark:text-gray-400 text-sm italic">Community lead to be announced.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white dark:bg-[#0C0C0E] py-20 text-center relative overflow-hidden border-t border-primary/10 dark:border-white/10 transition-colors">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <p className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-orange mb-3">
            <span className="h-px w-6 bg-accent-orange" /> Join Us Today
          </p>
          <h2 className="font-display text-primary dark:text-white text-4xl sm:text-5xl font-bold tracking-tight mb-8">
            Ready to Join the <span className="text-accent-orange">{community.name}</span> Community?
          </h2>
          <Link href="/join" className="group inline-flex items-center gap-2.5 rounded-full bg-accent-orange px-8 py-4 font-body text-base font-semibold text-white shadow-[0_10px_25px_rgba(249,115,22,0.22)] transition-all hover:bg-orange-600 hover:-translate-y-0.5">
            Apply for Membership
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  )
}
