// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { prisma } from "@/lib/prisma"
import { TeamTable } from "@/components/admin/team-table"
import Link from "next/link"
import { Plus } from "lucide-react"

// This function TeamPage handles the main work in this file and explains what this logic is doing in simple English.
export default async function TeamPage() {
  const members = await prisma.teamMember.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
  })
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-primary text-2xl font-bold">Team Members</h1>
          <p className="font-body text-muted text-sm mt-1">{members.length} members</p>
        </div>
        <Link href="/admin/team/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Member
        </Link>
      </div>
      <TeamTable initialMembers={members} />
    </div>
  )
}
