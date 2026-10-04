'use client'

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Communities", href: "/communities" },
  { name: "Events", href: "/events" },
  { name: "Team", href: "/team" },
  { name: "Gallery", href: "/gallery" },
  { name: "Join", href: "/join" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-primary/10 dark:border-white/10 bg-white/92 dark:bg-[#0C0C0E]/90 backdrop-blur-xl shadow-[0_8px_28px_rgba(15,36,96,0.05)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.6)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
        <div className="relative flex-shrink-0" style={{ width: "56px", height: "36px" }}>
            {/* Light mode: dark logo GIF */}
            <Image
              src="/circ-logo-dark.webp"
              alt="CIRC Logo"
              fill
              className="object-contain dark:hidden"
              sizes="56px"
            />
            {/* Dark mode: white fading logo GIF */}
            <Image
              src="/circ-logo-white.webp"
              alt="CIRC Logo"
              fill
              className="object-contain hidden dark:block"
              sizes="56px"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold leading-none text-primary dark:text-white transition-colors">
              CIRC
            </span>
            <span className="mt-0.5 hidden font-body text-[10px] leading-none sm:block text-muted dark:text-gray-400 transition-colors">
              Mama Ngina University College
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-sm transition-colors duration-200 ${
                  active
                    ? "text-primary dark:text-white border-b-2 border-accent-orange pb-0.5 font-semibold"
                    : "text-primary/75 dark:text-white/70 hover:text-primary dark:hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link
            href="/join"
            className="hidden md:inline-flex btn-primary text-xs px-4 py-2"
          >
            Apply Now
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1 transition-colors md:hidden text-primary/80 dark:text-white/80 hover:text-primary dark:hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-50 bg-white dark:bg-[#0C0C0E] border-b border-primary/10 dark:border-white/10 shadow-[0_8px_32px_rgba(15,36,96,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.8)] transition-colors duration-200">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center px-6 py-4 font-body text-sm border-b border-primary/5 dark:border-white/5 transition-colors ${
                  active
                    ? "text-primary dark:text-white bg-primary/5 dark:bg-white/5 font-semibold"
                    : "text-main dark:text-gray-300 hover:text-primary dark:hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            )
          })}
          <div className="p-4">
            <Link
              href="/join"
              onClick={() => setMobileOpen(false)}
              className="btn-primary w-full justify-center"
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
