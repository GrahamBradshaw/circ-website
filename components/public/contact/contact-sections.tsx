// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import Link from "next/link"
import { ArrowUpRight, Github, Instagram, Linkedin, Mail, MapPin, Twitter, Users } from "lucide-react"
import type { SocialProfile } from "@/lib/social-links"

function SocialIcon({ platform }: { platform: SocialProfile["platform"] }) {
  const size = 20
  if (platform === "GitHub") return <Github size={size} />
  if (platform === "X") return <Twitter size={size} />
  if (platform === "Instagram") return <Instagram size={size} />
  return <Linkedin size={size} />
}

function socialHandle(href: string): string {
  try {
    const url = new URL(href)
    const path = url.pathname.replace(/^\/+|\/+$/g, "")
    if (!path || path === "in") return href
    // linkedin.com/in/circ-mnu -> @circ-mnu, otherwise first path segment
    const handle = path.startsWith("in/") ? path.slice(3) : path.split("/")[0]
    return handle ? `@${handle}` : href
  } catch {
    return href
  }
}

// This function ContactCards handles the main work in this file and explains what this logic is doing in simple English.
export function ContactCards({ contactEmail }: { contactEmail: string }) {
  return (
    <section className="bg-surface-2 dark:bg-[#09090B] py-14 transition-colors">
      <div className="max-w-5xl mx-auto px-6 grid gap-5 md:grid-cols-3">
        <a
          href={`mailto:${contactEmail}`}
          className="rounded-3xl border border-primary/10 bg-white p-7 dark:border-white/10 dark:bg-[#121214] transition hover:border-primary/30 hover:shadow-md"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-orange/10 text-accent-orange">
            <Mail size={20} />
          </span>
          <span className="mt-4 block font-display text-xl font-bold text-primary dark:text-white">Email us</span>
          <span className="mt-2 block break-all font-body text-sm font-semibold text-accent-orange">{contactEmail}</span>
          <span className="mt-2 block font-body text-sm leading-relaxed text-muted dark:text-gray-400">
            Best for membership questions, partnerships, and collaborations.
          </span>
        </a>
        <div className="rounded-3xl border border-primary/10 bg-white p-7 dark:border-white/10 dark:bg-[#121214]">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-orange/10 text-accent-orange">
            <MapPin size={20} />
          </span>
          <p className="mt-4 font-display text-xl font-bold text-primary dark:text-white">Visit us</p>
          <p className="mt-2 font-body text-sm leading-relaxed text-muted dark:text-gray-400">
            Computing Innovation &amp; Research Club, Off Mutomo, Thangari Rd, Gatundu South, Kiambu County, Kenya.
          </p>
          <a
            href="https://share.google/5NucqVDcuhPzsBwSS"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block font-body text-sm font-semibold text-accent-orange underline decoration-accent-orange/40 underline-offset-4 hover:decoration-accent-orange"
          >
            Get directions
          </a>
        </div>
        <div className="rounded-3xl border border-primary/10 bg-white p-7 dark:border-white/10 dark:bg-[#121214]">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-orange/10 text-accent-orange">
            <Users size={20} />
          </span>
          <p className="mt-4 font-display text-xl font-bold text-primary dark:text-white">Join us</p>
          <p className="mt-2 font-body text-sm leading-relaxed text-muted dark:text-gray-400">
            Ready to build with us? Applications are reviewed on a rolling basis.
          </p>
          <Link
            href="/join"
            className="mt-3 inline-block font-body text-sm font-semibold text-accent-orange underline decoration-accent-orange/40 underline-offset-4 hover:decoration-accent-orange"
          >
            Apply for membership
          </Link>
        </div>
      </div>
    </section>
  )
}

// This function ContactSocials handles the main work in this file and explains what this logic is doing in simple English.
export function ContactSocials({ socialProfiles }: { socialProfiles: SocialProfile[] }) {
  if (socialProfiles.length === 0) return null
  return (
    <section aria-labelledby="contact-socials-heading" className="bg-white dark:bg-[#121215] border-t border-black/5 dark:border-white/10 transition-colors">
      <div className="max-w-5xl mx-auto px-6 py-14">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-orange">Stay connected</p>
        <h2 id="contact-socials-heading" className="mt-3 font-display text-2xl font-bold tracking-tight text-primary dark:text-white sm:text-3xl">
          Follow CIRC
        </h2>
        <p className="mt-3 max-w-2xl font-body text-base leading-relaxed text-muted dark:text-gray-300">
          Follow the Computing Innovation and Research Club at Mama Ngina University College for news, events, and projects.
        </p>
        <nav aria-label="Official CIRC social media profiles" className="mt-8 grid gap-3 sm:grid-cols-2">
          {socialProfiles.map(({ platform, label, href }) => (
            <a
              key={platform}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-primary/10 bg-surface-2 p-5 font-body text-primary transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md dark:border-white/10 dark:bg-[#141416] dark:text-white"
            >
              <span className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-accent-orange/10 text-accent-orange transition group-hover:bg-accent-orange group-hover:text-white">
                <SocialIcon platform={platform} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-base font-semibold">
                  {label}
                  <ArrowUpRight size={15} className="text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-orange dark:text-gray-500" />
                </span>
                <span className="mt-0.5 block truncate text-sm text-muted dark:text-gray-400">{socialHandle(href)}</span>
              </span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  )
}
