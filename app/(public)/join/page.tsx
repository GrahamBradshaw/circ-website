import { prisma } from "@/lib/prisma"
import { getPublicCached } from "@/lib/redis-cache"
import { ApplicationForm } from "@/components/public/join/application-form"
import { PageHero } from "@/components/public/page-hero"
import { createPageMetadata } from "@/lib/seo"
import { FALLBACK_COMMUNITIES } from "@/lib/public-fallbacks"

export const metadata = createPageMetadata({
  title: "Join CIRC at Mama Ngina University College",
  description: "Apply to join the Computing Innovation & Research Club (CIRC) at Mama Ngina University College. Build practical skills in computing, software, AI, data science, and technology.",
  path: "/join",
  keywords: ["join technology club Kenya", "MNUC student clubs", "Kenyatta University student technology", "SPAS students", "computing student community"],
})

export const revalidate = 300

export default async function JoinPage() {
  const communities = await getPublicCached("join:communities", () => prisma.community.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: "asc" },
  }), FALLBACK_COMMUNITIES)

  return (
    <div className="flex flex-col min-h-screen bg-surface-2 dark:bg-[#09090B] transition-colors">
      <PageHero
        badge="MEMBERSHIP APPLICATION"
        title={
          <>
            Become a <span className="text-accent-orange font-extrabold italic">CIRC</span> Member
          </>
        }
        subtitle="Join a community of innovators, researchers, and builders. Applications are reviewed on a rolling basis."
        size="md"
        image="/hero/hero-bg-1.0239ec49.webp"
        imageAlt="CIRC members working together"
      >
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {["Workshops", "Hackathons", "Mentorship", "Industry Connections", "Real Projects", "Community"].map((b) => (
            <span
              key={b}
              className="font-body text-xs font-medium px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#141416]/90 border border-primary/10 dark:border-white/10 text-primary/80 dark:text-gray-300 shadow-sm"
            >
              {b}
            </span>
          ))}
        </div>
      </PageHero>

      <section className="bg-surface-2 dark:bg-[#09090B] py-16 transition-colors">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white dark:bg-[#121214] rounded-3xl p-8 sm:p-12 border border-primary/10 dark:border-white/10 shadow-[0_10px_35px_rgba(15,36,96,0.05)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
            <ApplicationForm communities={communities} />
          </div>
        </div>
      </section>
    </div>
  )
}
