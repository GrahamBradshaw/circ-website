// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"

// This constant metadata stores shared values used by this file so the logic stays easier to follow.
export const metadata: Metadata = {
  title: "Admin Entry",
  robots: { index: false, follow: false },
}

// This function AdminEntryLayout handles the main work in this file and explains what this logic is doing in simple English.
export default function AdminEntryLayout({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>
}
