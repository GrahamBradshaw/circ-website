import { useState } from "react"
import { prisma } from "@/lib/prisma"
import { getPublicCached } from "@/lib/redis-cache"
import { ApplicationForm } from "@/components/public/join/application-form"
import { JoinFaqs } from "@/components/public/join/join-faqs"
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

const faqItems = [
  {
    question: "Who can apply to join CIRC?",
    answer:
      "CIRC is open to students at Mama Ngina University College, especially those in relevant programmes such as Computer Science, Information Technology, Mathematics and Computer Science, and Statistics and Programming. Students from the wider MNUC community may also apply if they are interested in technology, innovation, research, and collaboration.",
  },
  {
    question: "Do I need prior technical experience?",
    answer:
      "No. CIRC welcomes beginners, intermediate learners, and advanced students. We value curiosity, willingness to learn, and participation. Some communities run beginner-friendly workshops to help members build confidence.",
  },
  {
    question: "Can I join more than one community?",
    answer:
      "Yes. Members are encouraged to explore different communities based on their interests. You may join one or more communities depending on your goals and availability.",
  },
  {
    question: "What happens after I submit my application?",
    answer:
      "After submission, your application is reviewed by the club team or leadership. If you are shortlisted or accepted, you will normally receive follow-up communication with onboarding information, next steps, and event invitations.",
  },
  {
    question: "How long does the application review take?",
    answer:
      "Review times vary by intake and application volume. In most cases, applicants receive communication after the review process is complete, but the exact timeline should be checked on the current application page.",
  },
  {
    question: "What if I am not a tech major?",
    answer:
      "You are still welcome to apply if you are interested in technology, computing, innovation, or research. CIRC is a multidisciplinary community that brings together students with different backgrounds and skill levels.",
  },
  {
    question: "Can I apply if I am a first-year student?",
    answer:
      "Yes. First-year students are welcome to apply as long as they are interested in learning, building skills, and contributing to the club community.",
  },
  {
    question: "How can I contact the club?",
    answer:
      "You can contact CIRC through the official website contact page or the official email address listed on the website. Always use official public channels to avoid misinformation.",
  },
]

export default async function JoinPage() {
  const communities = await getPublicCached("join:communities", () => prisma.community.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: "asc" },
  }), FALLBACK_COMMUNITIES)

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface-2 dark:bg-[#09090B] transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />
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
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 xl:grid-cols-[1.6fr_0.9fr]">
            <div className="bg-white dark:bg-[#121214] rounded-[2rem] p-6 sm:p-8 lg:p-10 border border-primary/10 dark:border-white/10 shadow-[0_18px_60px_rgba(15,36,96,0.08)] dark:shadow-[0_18px_60px_rgba(0,0,0,0.52)]">
              <ApplicationForm communities={communities} />
            </div>

            <aside className="flex flex-col gap-6">
              <div className="rounded-[2rem] border border-primary/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#121214]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-orange">Need help?</p>
                <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-primary dark:text-white">Frequently asked questions</h3>
                <p className="mt-3 font-body text-sm leading-6 text-muted dark:text-gray-300">
                  Everything you need to know before submitting your membership application.
                </p>
              </div>

              <JoinFaqs items={faqItems} />
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
