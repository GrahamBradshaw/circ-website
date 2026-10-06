// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { formatRole } from "@/lib/utils"

interface Member {
  id: string
  name: string
  role: string
  photo: string | null
}

interface LeadershipTeaserProps {
  members?: Member[]
}

const DEFAULT_LEADERS: Member[] = [
  {
    id: "lead-1",
    name: "Arnold Chepkonga",
    role: "CHAIRPERSON",
    photo: null,
  },
  {
    id: "lead-2",
    name: "Evarline Awuor Mipata",
    role: "VICE_CHAIRPERSON",
    photo: null,
  },
  {
    id: "lead-3",
    name: "Samuel Maina",
    role: "SECRETARY",
    photo: null,
  },
  {
    id: "lead-4",
    name: "Wilson Ndiko",
    role: "EVENT_ORGANIZER",
    photo: null,
  },
  {
    id: "lead-5",
    name: "John Mary Nyajura",
    role: "TREASURER",
    photo: null,
  },
]

// This function LeadershipTeaser handles the main work in this file and explains what this logic is doing in simple English.
export function LeadershipTeaser({ members }: LeadershipTeaserProps) {
  // Use members if available, or fall back to default leadership
  const activeMembers = members && members.length > 0 ? members : DEFAULT_LEADERS
  const teaserMembers = activeMembers.slice(0, 5)

  return (
    <section className="py-24 bg-surface-2 dark:bg-[#080809] overflow-hidden border-b border-black/5 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-orange mb-3">
            <span className="h-px w-6 bg-accent-orange" /> Leadership Team
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-primary dark:text-white">
            The People Behind CIRC
          </h2>
          <p className="mt-4 font-body text-base sm:text-lg text-muted dark:text-gray-400 leading-relaxed">
            Executive committee and community leads driving the club forward.
          </p>
        </div>

        {/* Big, Modern Executive Cards Grid — 2 cards per row on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {teaserMembers.map((member) => {
            const isChair = member.role === "CHAIRPERSON"
            const initials = member.name
              .split(" ")
              .filter(Boolean)
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()

            return (
              <div
                key={member.id}
                className="group relative flex flex-col items-center text-center bg-white dark:bg-[#121214] rounded-3xl p-4 sm:p-7 border border-primary/10 dark:border-white/10 shadow-[0_8px_30px_rgba(15,36,96,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_45px_rgba(15,36,96,0.12)] hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                {/* Circular Profile Avatar */}
                <div className="relative mb-4">
                  {/* Subtle outer glow on hover */}
                  <div
                    className="absolute -inset-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
                    style={{
                      background: isChair
                        ? "linear-gradient(135deg, #F97316, #EA580C)"
                        : "linear-gradient(135deg, #1E3A8A, #38BDF8)",
                    }}
                  />

                  {/* Photo or Initials Avatar */}
                  <div
                    className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white dark:border-[#1E1E24] shadow-md flex-shrink-0"
                    style={{
                      boxShadow: isChair
                        ? "0 10px 25px rgba(249,115,22,0.25)"
                        : "0 10px 25px rgba(30,58,138,0.15)",
                    }}
                  >
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        sizes="(max-width: 640px) 112px, 128px"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: isChair
                            ? "linear-gradient(135deg, #1E3A8A, #F97316)"
                            : "linear-gradient(135deg, #0F2460, #1E3A8A)",
                        }}
                      >
                        <span className="font-display text-white font-extrabold text-2xl sm:text-3xl tracking-wider select-none">
                          {initials}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Member Info */}
                <div className="flex flex-col items-center gap-2 w-full mt-2">
                  <h3 className="font-display text-primary dark:text-white text-base sm:text-lg font-bold tracking-tight leading-snug group-hover:text-accent-orange transition-colors">
                    {member.name}
                  </h3>

                  {/* Role Pill Badge */}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                      isChair
                        ? "bg-accent-orange/10 text-accent-orange border border-accent-orange/20"
                        : "bg-primary/5 dark:bg-white/10 text-primary/80 dark:text-gray-300 border border-primary/10 dark:border-white/10"
                    }`}
                  >
                    {formatRole(member.role)}
                  </span>
                </div>

                {/* Bottom decorative color bar on hover */}
                <div
                  className="absolute bottom-0 inset-x-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"
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

        {/* CTA Button */}
        <div className="text-center mt-14">
          <Link
            href="/team"
            className="group inline-flex items-center gap-2.5 rounded-full border border-primary/15 dark:border-white/15 bg-white dark:bg-[#121214] px-8 py-3.5 font-body text-sm font-semibold text-primary dark:text-white shadow-sm hover:bg-primary dark:hover:bg-white hover:text-white dark:hover:text-black hover:border-primary dark:hover:border-white hover:shadow-md transition-all duration-200"
          >
            Meet Our Full Team
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 text-accent-orange group-hover:text-white dark:group-hover:text-black" />
          </Link>
        </div>
      </div>
    </section>
  )
}
