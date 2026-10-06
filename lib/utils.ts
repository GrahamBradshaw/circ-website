// This file is part of the CIRC website.
// It belongs to the library layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// This function cn handles the main work in this file and explains what this logic is doing in simple English.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// This function stripHtml handles the main work in this file and explains what this logic is doing in simple English.
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

// This function formatRole handles the main work in this file and explains what this logic is doing in simple English.
export function formatRole(role: string): string {
  const map: Record<string, string> = {
    CHAIRPERSON: "Chairperson",
    VICE_CHAIRPERSON: "Vice Chairperson",
    SECRETARY: "Secretary",
    TREASURER: "Treasurer",
    EVENT_ORGANIZER: "Event Organizer",
    COMMUNITY_LEAD: "Community Lead",
    COMMUNITY_CO_LEADER: "Community Co-Leader",
  }
  return map[role] ?? role
}
