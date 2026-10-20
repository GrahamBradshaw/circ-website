// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { prisma } from "@/lib/prisma"
import { getPublicCached } from "@/lib/redis-cache"
import Image from "next/image"
import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"
import { formatRole } from "@/lib/utils"
import { COMMUNITY_COLORS } from "@/components/public/communities/community-icons"
import { PageHero } from "@/components/public/page-hero"
import { createPageMetadata } from "@/lib/seo"

// This constant metadata stores shared values used by this file so the logic stays easier to follow.
export const metadata = createPageMetadata({
  title: "CIRC Leadership and Community Leads",
  description: "Meet the student leaders and technology community leads of the Computing Innovation & Research Club at Mama Ngina University College.",
  path: "/team",
  keywords: ["CIRC student leaders", "MNUC technology community leads", "Kenyatta University student leadership", "computing club committee"],
})

// This constant revalidate stores shared values used by this file so the logic stays easier to follow.
export const revalidate = 300

const enumToSlug: Record<string, string> = {
  WEB_DEV: "web-development",
  DATA_SCIENCE: "data-science",
  AI_ML: "ai-ml",
  WEB3_BLOCKCHAIN: "web3-blockchain",
  PROGRAMMING: "programming",
  IOT: "iot",
  NETWORKING_CYBERSECURITY: "networking-cybersecurity",
  GDG: "gdg",
}

// This function TeamPage handles the main work in this file and explains what this logic is doing in simple English.
export default async function TeamPage() {
  const [execs, leads] = await Promise.all([
    getPublicCached("team:members", () => prisma.teamMember.findMany({
      where: { role: { notIn: ["COMMUNITY_LEAD", "COMMUNITY_CO_LEADER"] as any } },
      orderBy: { displayOrder: "asc" },
    }), []),
    getPublicCached("team:community-leads", () => prisma.teamMember.findMany({
      where: { role: { in: ["COMMUNITY_LEAD", "COMMUNITY_CO_LEADER"] as any } },
      orderBy: { displayOrder: "asc" },
    }), []),
  ])

  return (
    <div className="flex flex-col">
      <PageHero
        badge="CIRC LEADERSHIP 2025/26"
        title="The People Behind CIRC"
        subtitle="Executive committee and community leads driving innovation, research, and community forward."
        size="md"
        image="/hero/hero-bg-4.6502a1ab.webp"
        imageAlt="CIRC team photo"
      />

      {/* Executive Committee section */}
      <section className="bg-surface-2 dark:bg-[#09090B] py-20 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <p className="font-mono text-accent-orange text-[10px] font-semibold tracking-[0.2em] uppercase mb-2">
              EXECUTIVE COMMITTEE
            </p>
            <h2 className="font-display text-primary dark:text-white text-3xl sm:text-4xl font-bold tracking-tight">Club Officers</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {execs.map((member) => {
              const isChair = member.role === "CHAIRPERSON"
              return (
                <div key={member.id} className="group bg-white dark:bg-[#121214] rounded-3xl border border-primary/10 dark:border-white/10 p-7 flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(15,36,96,0.12)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.8)] transition-all duration-300 relative overflow-hidden">

                  {/* Chairperson only: orange accent badge */}
                  {isChair && (
                    <div className="absolute top-4 right-4 bg-accent-orange text-white font-mono text-[9px] font-bold px-3 py-1 rounded-full tracking-wider z-10 shadow-sm">
                      CHAIR
                    </div>
                  )}

                  {/* Circular photo */}
                  <div className="relative mb-5">
                    {/* Outer glow ring animates on hover */}
                    <div className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
                      style={{
                        background: isChair
                          ? "linear-gradient(135deg, #F97316, #EA580C)"
                          : "linear-gradient(135deg, #1E3A8A, #38BDF8)"
                      }}
                    />

                    {/* Photo circle */}
                    <div
                      className="relative rounded-full overflow-hidden border-4 border-white dark:border-[#202025] shadow-md flex-shrink-0"
                      style={{
                        width: isChair ? "124px" : "110px",
                        height: isChair ? "124px" : "110px",
                      }}
                    >
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.name}
                          fill
                          sizes="124px"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        /* Fallback: initials on gradient background */
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{
                            background: isChair
                              ? "linear-gradient(135deg, #1E3A8A, #F97316)"
                              : "linear-gradient(135deg, #0F2460, #1E3A8A)",
                          }}
                        >
                          <span className="font-display text-white font-extrabold text-2xl">
                            {member.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Member details below the circle */}
                  <div className="flex flex-col items-center gap-1.5 flex-1 w-full">
                    <h3 className="font-display text-primary dark:text-white text-lg font-bold leading-tight group-hover:text-accent-orange transition-colors">
                      {member.name}
                    </h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                        isChair
                          ? "bg-accent-orange/10 text-accent-orange border border-accent-orange/20"
                          : "bg-primary/5 dark:bg-white/5 text-primary/80 dark:text-gray-300 border border-primary/10 dark:border-white/10"
                      }`}
                    >
                      {formatRole(member.role)}
                    </span>
                    {member.bio && (
                      <p className="font-body text-muted dark:text-gray-400 text-xs leading-relaxed line-clamp-2 mt-2 max-w-[220px]">
                        {member.bio}
                      </p>
                    )}

                    {/* Social links */}
                    {(member.linkedin || member.github || member.twitter) && (
                      <div className="flex items-center justify-center gap-2 mt-4">
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full flex items-center justify-center text-primary/70 dark:text-gray-300 hover:text-accent-orange bg-surface-2 dark:bg-[#1C1C20] hover:bg-white dark:hover:bg-[#25252B] transition-colors border border-primary/10 dark:border-white/10"
                            aria-label="LinkedIn">
                            <Linkedin size={13} />
                          </a>
                        )}
                        {member.github && (
                          <a href={member.github} target="_blank" rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full flex items-center justify-center text-primary/70 dark:text-gray-300 hover:text-accent-orange bg-surface-2 dark:bg-[#1C1C20] hover:bg-white dark:hover:bg-[#25252B] transition-colors border border-primary/10 dark:border-white/10"
                            aria-label="GitHub">
                            <Github size={13} />
                          </a>
                        )}
                        {member.twitter && (
                          <a href={member.twitter} target="_blank" rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full flex items-center justify-center text-primary/70 dark:text-gray-300 hover:text-accent-orange bg-surface-2 dark:bg-[#1C1C20] hover:bg-white dark:hover:bg-[#25252B] transition-colors border border-primary/10 dark:border-white/10"
                            aria-label="Twitter / X">
                            <Twitter size={13} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"
                    style={{
                      background: isChair
                        ? "linear-gradient(90deg, #F97316, #FB923C)"
                        : "linear-gradient(90deg, #1E3A8A, #38BDF8)",
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Community Leads Section */}
      <section className="py-20 bg-surface-2 dark:bg-[#09090B] border-t border-primary/10 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <p className="font-mono text-accent-orange text-[10px] font-semibold tracking-[0.2em] uppercase mb-2">
              COMMUNITY LEADS
            </p>
            <h2 className="font-display text-primary dark:text-white text-3xl sm:text-4xl font-bold tracking-tight">Domain Specialists</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {leads.filter(m => m.name && m.name.trim() !== "").map((member) => {
              const communitySlug = member.community ? enumToSlug[member.community] : "programming"
              return (
                <div
                  key={member.id}
                  className="group bg-white dark:bg-[#121214] rounded-3xl p-7 flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(15,36,96,0.1)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.8)] transition-all duration-300 relative overflow-hidden border border-primary/10 dark:border-white/10"
                >
                  {/* Circular photo */}
                  <div className="relative mb-5">
                    {/* Outer glow ring */}
                    <div className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
                      style={{ background: "linear-gradient(135deg, #1E3A8A, #38BDF8)" }}
                    />
                    {/* Photo circle */}
                    <div
                      className="relative rounded-full overflow-hidden border-4 border-white dark:border-[#202025] shadow-md flex-shrink-0 w-28 h-28"
                    >
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.name}
                          fill
                          sizes="112px"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg, #0F2460, #1E3A8A)" }}
                        >
                          <span className="font-display text-white font-extrabold text-2xl">
                            {member.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Member details below the circle */}
                  <div className="flex flex-col items-center gap-1.5 flex-1 w-full">
                    <h3 className="font-display text-primary dark:text-white text-lg font-bold leading-tight group-hover:text-accent-orange transition-colors">
                      {member.name}
                    </h3>
                    <span className="inline-block font-mono text-[10px] tracking-wider uppercase font-semibold text-accent-orange">
                      {formatRole(member.role)}
                    </span>
                    
                    {member.community && (
                      <span
                        className="inline-block font-mono text-[9px] font-bold px-3 py-1 rounded-full mt-1 border border-primary/10 dark:border-white/10"
                        style={{
                          background: COMMUNITY_COLORS[communitySlug]?.bg ?? "#F0F4FF",
                          color: COMMUNITY_COLORS[communitySlug]?.text ?? "#1E3A8A",
                        }}
                      >
                        {member.community === "NETWORKING_CYBERSECURITY" ? "Networking and Cybersecurity" : member.community === "GDG" ? "Google Developer Groups" : member.community.replace(/_/g, " ")}
                      </span>
                    )}

                    {member.bio && (
                      <p className="font-body text-muted dark:text-gray-400 text-xs leading-relaxed line-clamp-2 mt-2 max-w-[220px]">
                        {member.bio}
                      </p>
                    )}

                    {/* Social links */}
                    {(member.linkedin || member.github || member.twitter) && (
                      <div className="flex items-center justify-center gap-2 mt-4">
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full flex items-center justify-center text-primary/70 dark:text-gray-300 hover:text-accent-orange bg-surface-2 dark:bg-[#1C1C20] hover:bg-white dark:hover:bg-[#25252B] transition-colors border border-primary/10 dark:border-white/10"
                            aria-label="LinkedIn">
                            <Linkedin size={13} />
                          </a>
                        )}
                        {member.github && (
                          <a href={member.github} target="_blank" rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full flex items-center justify-center text-primary/70 dark:text-gray-300 hover:text-accent-orange bg-surface-2 dark:bg-[#1C1C20] hover:bg-white dark:hover:bg-[#25252B] transition-colors border border-primary/10 dark:border-white/10"
                            aria-label="GitHub">
                            <Github size={13} />
                          </a>
                        )}
                        {member.twitter && (
                          <a href={member.twitter} target="_blank" rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full flex items-center justify-center text-primary/70 dark:text-gray-300 hover:text-accent-orange bg-surface-2 dark:bg-[#1C1C20] hover:bg-white dark:hover:bg-[#25252B] transition-colors border border-primary/10 dark:border-white/10"
                            aria-label="Twitter / X">
                            <Twitter size={13} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"
                    style={{ background: "linear-gradient(90deg, #1E3A8A, #38BDF8)" }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
