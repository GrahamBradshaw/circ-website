// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Grid3x3, 
  Image as ImageIcon, 
  ClipboardList, 
  Settings,
  LogOut
} from "lucide-react"
import { useUser, useClerk } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Team Members", href: "/admin/team", icon: Users },
  { label: "Communities", href: "/admin/communities", icon: Grid3x3 },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Applications", href: "/admin/applications", icon: ClipboardList },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

// This function Sidebar handles the main work in this file and explains what this logic is doing in simple English.
export function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const { signOut } = useClerk()

  return (
    <aside className="w-60 flex-shrink-0 bg-primary-dark flex flex-col h-screen sticky top-0">
      {/* Logo area */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="relative w-8 h-8 flex-shrink-0">
          <Image
            src="/logo.webp"
            alt="CIRC"
            fill
            className="object-contain"
            sizes="32px"
          />
        </div>
        <div>
          <p className="font-display text-white text-base font-bold leading-none">CIRC</p>
          <p className="font-body text-accent-sky text-xs mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Nav section */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <div key={item.href} className="mb-1">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition-all duration-150 cursor-pointer w-full",
                  isActive 
                    ? "text-white bg-white/10 border-l-4 border-accent-orange pl-2.5" 
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon size={18} className="flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
              </Link>
            </div>
          )
        })}
      </nav>

      {/* Bottom user section */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
            {user?.imageUrl && (
              <img src={user.imageUrl} alt={user.fullName || "User"} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-body text-white text-sm font-medium truncate">{user?.fullName}</p>
            <p className="font-body text-white/50 text-xs truncate">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
        
        <button 
          onClick={() => signOut({ redirectUrl: "/" })}
          className="mt-3 w-full flex items-center gap-2 font-body text-white/60 text-xs hover:text-white transition-colors cursor-pointer py-2 px-1 rounded-md hover:bg-white/10"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
