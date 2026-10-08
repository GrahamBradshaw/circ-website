// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { prisma, safeDbQuery } from "@/lib/prisma"
import { SettingsForm } from "@/components/admin/settings/settings-form"

// This function AdminSettingsPage handles the main work in this file and explains what this logic is doing in simple English.
export default async function AdminSettingsPage() {
  const settings = await safeDbQuery(() => prisma.settings.findUnique({
    where: { id: "singleton" },
  }), null)

  const safeSettings = settings || {
    contactEmail: "circ@mnu.ac.ke",
    linkedin: "",
    twitter: "",
    instagram: "",
    github: "",
    aboutText: "Computing Innovation and Research Club at Mama Ngina University College.",
    maintenance: false,
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-primary text-2xl font-bold">System Settings</h1>
        <p className="font-body text-muted text-sm mt-1">Configure global variables, social links, and maintenance status.</p>
      </div>

      <SettingsForm initialData={safeSettings} />
    </div>
  )
}
