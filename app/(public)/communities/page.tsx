import { prisma } from "@/lib/prisma"
import { getPublicCached } from "@/lib/redis-cache"
import Image from "next/image"
import Link from "next/link"
import { Globe2, BarChart2, Brain, Link2, Code2, Wifi, Shield } from "lucide-react"
import { PageHero } from "@/components/public/page-hero"
import { createPageMetadata } from "@/lib/seo"
import { FALLBACK_COMMUNITIES } from "@/lib/public-fallbacks"

const iconMap: Record<string, any> = {
  WEB_DEV: Globe2,
  DATA_SCIENCE: BarChart2,
  AI_ML: Brain,
  WEB3_BLOCKCHAIN: Link2,
  PROGRAMMING: Code2,
  IOT: Wifi,
  NETWORKING_CYBERSECURITY: Shield,
}

const TECH_TAGS = [
  {
    name: "Python",
    color: "#3776AB",
    bgColor: "rgba(55,118,171,0.12)",
    borderColor: "rgba(55,118,171,0.3)",
    delay: "0s", duration: "7s", top: "12%", left: "8%",
    logo: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#3776AB">
        <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.178 3.403 5.96 3.403 5.96h2.031v-2.867s-.109-3.402 3.35-3.402h5.769s3.24.052 3.24-3.13V3.23S18.28 0 11.914 0zm-3.2 1.867c.577 0 1.043.466 1.043 1.044 0 .577-.466 1.043-1.043 1.043A1.043 1.043 0 0 1 7.67 2.91c0-.578.466-1.044 1.043-1.044z"/>
        <path d="M12.086 24c6.096 0 5.716-2.656 5.716-2.656l-.007-2.752h-5.814v-.826h8.121S24 18.211 24 12.031c0-6.178-3.403-5.96-3.403-5.96h-2.031v2.867s.109 3.402-3.35 3.402H9.447s-3.24-.052-3.24 3.13V20.77S5.72 24 12.086 24zm3.2-1.867a1.043 1.043 0 0 1-1.043-1.044c0-.577.466-1.043 1.043-1.043.578 0 1.044.466 1.044 1.043 0 .578-.466 1.044-1.044 1.044z" opacity="0.7"/>
      </svg>
    ),
  },
  {
    name: "React",
    color: "#61DAFB",
    bgColor: "rgba(97,218,251,0.1)",
    borderColor: "rgba(97,218,251,0.25)",
    delay: "1s", duration: "9s", top: "8%", left: "35%",
    logo: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#61DAFB">
        <circle cx="12" cy="12" r="2.139"/>
        <path d="M12 4.929c5.184 0 9.389 3.154 9.389 7.071 0 3.918-4.205 7.071-9.389 7.071S2.611 15.918 2.611 12c0-3.917 4.205-7.071 9.389-7.071zm0-1.5C6.477 3.429 1.111 7.26 1.111 12s5.366 8.571 10.889 8.571S22.889 16.74 22.889 12 17.523 3.429 12 3.429z" opacity="0.5"/>
        <path d="M7.432 6.535c2.592-4.487 6.574-6.944 8.917-5.49 2.344 1.455 2.037 6.29-.555 10.777-2.592 4.486-6.574 6.943-8.917 5.489-2.344-1.454-2.037-6.29.555-10.776zm-.75-.433C3.75 11.028 3.7 16.252 6.393 17.862c2.694 1.61 7.347-.946 10.279-5.828 2.932-4.883 2.882-10.107.188-11.717C14.166-1.293 9.513 1.263 6.682 6.102z" opacity="0.5"/>
      </svg>
    ),
  },
  {
    name: "TensorFlow",
    color: "#FF6F00",
    bgColor: "rgba(255,111,0,0.1)",
    borderColor: "rgba(255,111,0,0.25)",
    delay: "0.5s", duration: "8s", top: "20%", right: "10%",
    logo: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF6F00">
        <path d="M0 0v24l6-3.462V6.923L0 0zm6 6.923v13.615L12 24V10.385L6 6.923zm6 3.462V24l6-3.462V10.385L12 10.385zm6 0v10.153L24 24V0l-6 10.385z" opacity="0.8"/>
      </svg>
    ),
  },
  {
    name: "Solidity",
    color: "#818CF8",
    bgColor: "rgba(129,140,248,0.1)",
    borderColor: "rgba(129,140,248,0.25)",
    delay: "2s", duration: "10s", top: "65%", left: "6%",
    logo: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#818CF8">
        <path d="M14.19.087l-4.5 8h9l-4.5-8zM9.69 8.087l-4.5 8h9l-4.5-8zM5.19 16.087l-4.5 8h9l-4.5-8zM14.31 8.087l4.5 8h-9l4.5-8zM18.81 16.087l4.5 8h-9l4.5-8z" opacity="0.9"/>
      </svg>
    ),
  },
  {
    name: "Arduino",
    color: "#00979D",
    bgColor: "rgba(0,151,157,0.1)",
    borderColor: "rgba(0,151,157,0.25)",
    delay: "1.5s", duration: "11s", top: "75%", right: "12%",
    logo: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#00979D">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 15.5H7a3.5 3.5 0 0 1 0-7h3.5v1.5H7a2 2 0 0 0 0 4h3.5V15.5zm2 0V14h3.5a2 2 0 0 0 0-4H13.5V8.5H17a3.5 3.5 0 0 1 0 7h-3.5zm-2-3.25v-1.5h3v1.5h-3z"/>
      </svg>
    ),
  },
  {
    name: "Node.js",
    color: "#339933",
    bgColor: "rgba(51,153,51,0.1)",
    borderColor: "rgba(51,153,51,0.25)",
    delay: "3s", duration: "8.5s", top: "40%", left: "3%",
    logo: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#339933">
        <path d="M11.998 24a2.248 2.248 0 0 1-1.123-.302l-3.567-2.11c-.533-.298-.273-.404-.097-.465.71-.247.854-.303 1.61-.733.08-.044.183-.027.265.02l2.74 1.627a.356.356 0 0 0 .33 0l10.672-6.159a.345.345 0 0 0 .165-.298V8.42a.35.35 0 0 0-.167-.3L12.164 1.963a.345.345 0 0 0-.33 0L1.164 8.12a.35.35 0 0 0-.166.3v12.317c0 .122.063.237.166.298l2.927 1.69c1.588.794 2.56-.141 2.56-1.078V9.426a.316.316 0 0 1 .315-.315h1.37c.172 0 .314.141.314.315v11.221c0 2.108-1.148 3.318-3.148 3.318-.614 0-1.097 0-2.45-.666L.834 21.357A2.265 2.265 0 0 1 .001 19.44V7.12a2.27 2.27 0 0 1 1.133-1.97L10.874.302a2.34 2.34 0 0 1 2.25 0l9.74 5.848A2.27 2.27 0 0 1 24 8.12V20.44a2.265 2.265 0 0 1-1.133 1.96l-9.741 5.596a2.248 2.248 0 0 1-1.128.004z" opacity="0.9"/>
      </svg>
    ),
  },
  {
    name: "SQL",
    color: "#F29111",
    bgColor: "rgba(242,145,17,0.1)",
    borderColor: "rgba(242,145,17,0.25)",
    delay: "2.5s", duration: "7.5s", top: "30%", left: "20%",
    logo: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#F29111">
        <path d="M12 1C5.925 1 1 3.925 1 7.5S5.925 14 12 14s11-2.925 11-6.5S18.075 1 12 1zm0 11.5c-5.238 0-9.5-2.243-9.5-5S6.762 2.5 12 2.5s9.5 2.243 9.5 5-4.262 5-9.5 5z" opacity="0.9"/>
        <path d="M2.5 10.5v3C2.5 17.075 6.925 20 12 20s9.5-2.925 9.5-6.5v-3c0 3.575-4.262 6.5-9.5 6.5s-9.5-2.925-9.5-6.5z" opacity="0.7"/>
        <path d="M2.5 16.5v3C2.5 23.075 6.925 26 12 26s9.5-2.925 9.5-6.5v-3c0 3.575-4.262 6.5-9.5 6.5s-9.5-2.925-9.5-6.5z" opacity="0.4"/>
      </svg>
    ),
  },
]

export const metadata = createPageMetadata({
  title: "Technology Communities at Mama Ngina University College",
  description: "Explore CIRC student communities in web development, programming, AI and machine learning, data science, Web3, IoT, networking, and cybersecurity.",
  path: "/communities",
  keywords: ["web development community", "programming club", "AI and machine learning", "data science", "Web3 and blockchain", "Internet of Things", "networking and cybersecurity", "SPAS", "Kenyatta University technology"],
})

export const revalidate = 300

export default async function CommunitiesPage() {
  const communities = await getPublicCached("communities:with-leads", () => prisma.community.findMany({
    include: {
      lead: true,
    },
  }), FALLBACK_COMMUNITIES)

  return (
    <div className="flex flex-col">
      <PageHero
        badge="7 ACTIVE COMMUNITIES"
        title="Our Communities"
        subtitle="Seven disciplines. One shared mission. Find your people and build something meaningful."
        size="lg"
        image="/hero/hero-bg-2.90cbe47a.webp"
        imageAlt="CIRC community members collaborating"
      />

      {/* Communities 2-column grid */}
      <section className="bg-surface-2 dark:bg-[#09090B] py-20 transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communities.map((community) => {
              const typeMap: Record<string, string> = {
                "web-development": "WEB_DEV",
                "data-science-and-modelling": "DATA_SCIENCE",
                "ai-and-machine-learning": "AI_ML",
                "web3-and-blockchain": "WEB3_BLOCKCHAIN",
                "programming-community": "PROGRAMMING",
                "internet-of-things": "IOT",
                "networking-cybersecurity": "NETWORKING_CYBERSECURITY",
              }
              const type = typeMap[community.slug] || "PROGRAMMING"
              const Icon = iconMap[type] || Code2

              return (
                <div
                  key={community.id}
                  className="bg-white dark:bg-[#121214] rounded-3xl border border-primary/10 dark:border-white/10 p-7 flex flex-col shadow-[0_8px_30px_rgba(15,36,96,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_45px_rgba(15,36,96,0.08)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.8)] hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Icon + Name */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-surface-2 dark:bg-[#1A1A1E] border border-primary/10 dark:border-white/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={22} className="text-accent-orange" />
                    </div>
                    <h2 className="font-display text-primary dark:text-white text-xl font-bold leading-tight transition-colors">
                      {community.name}
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="font-body text-muted dark:text-gray-400 text-sm leading-relaxed mb-5 flex-1 transition-colors">
                    {community.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {community.focusTags.map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary/5 dark:bg-white/5 text-primary/80 dark:text-gray-300 border border-primary/10 dark:border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Lead + CTA row */}
                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-primary/5 dark:border-white/10">
                    {community.lead ? (
                      <div className="flex items-center gap-2.5">
                        {community.lead.photo ? (
                          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white dark:border-[#222226] shadow-sm flex-shrink-0">
                            <Image
                              src={community.lead.photo}
                              alt={community.lead.name}
                              width={36}
                              height={36}
                              className="object-cover object-top"
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {community.lead.name[0]}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-body text-main dark:text-white text-xs font-semibold truncate leading-tight">
                            {community.lead.name}
                          </p>
                          <span className="font-body text-accent-orange text-[10px] font-semibold uppercase tracking-wider">
                            Community Lead
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="font-body text-muted dark:text-gray-400 text-xs italic">Lead to be announced</p>
                    )}

                    <Link
                      href={`/communities/${community.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-accent-orange px-5 py-2.5 font-body text-xs font-semibold text-white shadow-[0_8px_20px_rgba(249,115,22,0.22)] transition-all hover:bg-orange-600 hover:-translate-y-0.5 active:scale-95 flex-shrink-0"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
