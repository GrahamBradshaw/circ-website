// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { TeamForm } from "@/components/admin/forms/team-form"

// This function EditTeamMemberPage handles the main work in this file and explains what this logic is doing in simple English.
export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await prisma.teamMember.findUnique({
    where: { id },
  })

  if (!member) notFound()

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-primary text-2xl font-bold">Edit Team Member</h1>
        <p className="font-body text-muted text-sm mt-1">Update member details below.</p>
      </div>
      <TeamForm member={member} />
    </div>
  )
}
