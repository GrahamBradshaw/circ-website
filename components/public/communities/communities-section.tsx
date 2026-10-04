import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ArrowRight } from "lucide-react"
import { COMMUNITY_ICONS, COMMUNITY_COLORS } from "./community-icons"

interface Community {
  id: string
  name: string
  slug: string
  description: string
  focusTags: string[]
  heroImage?: string | null
}

interface CommunitiesSectionProps {
  communities: Community[]
}

const COMMUNITY_PHOTOS = [
  "/hero/hero-bg-3.jpg",
  "/hero/hero-bg-4.jpg",
  "/hero/hero-bg-2.jpg",
  "/hero/hero-bg-5.jpg",
  "/hero/hero-bg-1.jpg",
]

export function CommunitiesSection({ communities }: CommunitiesSectionProps) {
  const visibleCommunities = communities.slice(0, 6)
  const totalCount = communities.length

  return (
    <section className="overflow-hidden bg-surface-2 dark:bg-[#080809] py-24 md:py-32 border-b border-black/5 dark:border-white/10 transition-colors">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between md:mb-16">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-orange">
              <span className="h-px w-7 bg-accent-orange" /> Find your people
            </p>
            <h2 className="max-w-3xl font-display text-4xl font-bold leading-[0.98] tracking-[-0.06em] text-primary dark:text-white sm:text-5xl md:text-6xl">
              {totalCount} communities.<br className="hidden sm:block" /> One mission.
            </h2>
            <p className="mt-5 max-w-xl font-body text-base leading-relaxed text-muted dark:text-gray-400 md:text-lg">
              Find your discipline. Build with purpose. Connect with people who think like you.
            </p>
          </div>
          <Link href="/communities" className="group inline-flex w-fit items-center gap-3 rounded-full border border-primary/15 dark:border-white/15 bg-white dark:bg-[#121214] px-5 py-3 font-body text-sm font-semibold text-primary dark:text-gray-200 transition-colors hover:border-primary/40 dark:hover:border-white/30 hover:bg-primary dark:hover:bg-white hover:text-white dark:hover:text-black">
            All {totalCount} communities <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCommunities.map((community, index) => {
            const colors = COMMUNITY_COLORS[community.slug] ?? COMMUNITY_COLORS.programming
            const Icon = COMMUNITY_ICONS[community.slug]
            const image = community.heroImage || COMMUNITY_PHOTOS[index % COMMUNITY_PHOTOS.length]

            return (
              <Link
                key={community.id}
                href={`/communities/${community.slug}`}
                className="group relative isolate flex min-h-[390px] flex-col justify-between overflow-hidden rounded-[1.35rem] bg-primary p-6 text-white shadow-[0_12px_35px_rgba(15,36,96,0.12)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(15,36,96,0.22)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-orange/50 sm:min-h-[430px] sm:p-7"
              >
                <Image src={image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" quality={60} className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105" />
                <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-dark/55 via-primary-dark/30 to-primary-dark/95" />

                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-primary/30 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/90 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-green" /> CIRC community
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/45 bg-white/10 text-white backdrop-blur transition duration-300 group-hover:border-accent-orange group-hover:bg-accent-orange">
                    <ArrowUpRight size={18} />
                  </span>
                </div>

                <div className="mt-10">
                  {Icon && (
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-white/30 shadow-sm backdrop-blur-sm" style={{ backgroundColor: colors.bg }}>
                      <Icon className="h-6 w-6" style={{ color: colors.icon }} />
                    </div>
                  )}
                  <h3 className="font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
                    {community.name}
                  </h3>
                  <p className="mt-3 line-clamp-2 max-w-md font-body text-sm leading-relaxed text-white/80 sm:text-base">
                    {community.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {community.focusTags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 font-body text-[10px] font-medium text-white/90 backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                    {community.focusTags.length > 3 && (
                      <span className="rounded-full border border-white/25 px-3 py-1.5 font-body text-[10px] text-white/75">+{community.focusTags.length - 3}</span>
                    )}
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 font-body text-sm font-semibold text-white transition-colors group-hover:text-orange-200">
                    Explore community <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
                <span aria-hidden="true" className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-accent-orange transition-transform duration-500 group-hover:scale-x-100" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
