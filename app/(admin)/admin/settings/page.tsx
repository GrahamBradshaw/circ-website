import { prisma } from "@/lib/prisma"
import { SettingsForm } from "@/components/admin/settings/settings-form"

export default async function AdminSettingsPage() {
  const settings = await prisma.settings.findUnique({
    where: { id: "singleton" },
  })

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
