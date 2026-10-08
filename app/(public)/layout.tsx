// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"

export const dynamic = "force-dynamic"

// This function PublicLayout handles the main work in this file and explains what this logic is doing in simple English.
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="public-site min-h-screen flex flex-col bg-white dark:bg-[#080809] text-main dark:text-gray-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
