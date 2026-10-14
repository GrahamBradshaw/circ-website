// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import type { Metadata } from "next"

// This constant metadata stores shared values used by this file so the logic stays easier to follow.
export const metadata: Metadata = {
  title: "Account Created",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

// This function PrivateRouteLayout handles the main work in this file and explains what this logic is doing in simple English.
export default function PrivateRouteLayout({ children }: { children: React.ReactNode }) {
  return children
}
