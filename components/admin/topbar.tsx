// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
"use client"

import { UserButton } from "@clerk/nextjs"
import { Bell } from "lucide-react"

interface TopbarProps {
  title?: string
}

// This function Topbar handles the main work in this file and explains what this logic is doing in simple English.
export function Topbar({ title = "Admin Panel" }: TopbarProps) {
  return (
    <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-6 flex-shrink-0">
      {/* Left side: dynamic page title */}
      <h2 className="font-display text-primary text-lg font-semibold">
        {title}
      </h2>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <Bell className="text-muted hover:text-main cursor-pointer transition-colors" size={20} />
        <div className="w-px h-6 bg-border" />
        <UserButton 
          appearance={{
            elements: {
              userButtonAvatarBox: "w-8 h-8 rounded-full border border-border shadow-sm"
            }
          }}
        />
      </div>
    </header>
  )
}
