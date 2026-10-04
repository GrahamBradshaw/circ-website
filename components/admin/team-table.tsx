'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatRole } from "@/lib/utils"

type Member = {
  id: string
  name: string
  role: string
  community: string | null
  photo: string
  displayOrder: number
}

export function TeamTable({ initialMembers }: { initialMembers: Member[] }) {
  const [members, setMembers] = useState(initialMembers)
  const [toast, setToast] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const router = useRouter()

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function deleteMember(id: string) {
    const res = await fetch(`/api/team/${id}`, { method: "DELETE" })
    if (res.ok) {
      setMembers(prev => prev.filter(m => m.id !== id))
      setConfirmDelete(null)
      showToast("Member removed")
      router.refresh()
    } else {
      showToast("Delete failed. Please try again.")
    }
  }

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <div className="space-y-4">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-primary text-white font-body text-sm px-5 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-border p-6 max-w-sm w-full text-center">
            <h3 className="font-display text-primary text-xl font-bold mb-2">Remove Member?</h3>
            <p className="font-body text-muted text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteMember(confirmDelete)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-body text-sm py-2.5 rounded-lg transition-colors"
              >Remove</button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 btn-outline text-sm py-2.5"
              >Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-2">
            <tr>
              {["Member", "Role", "Community", "Order", "Actions"].map(h => (
                <th key={h} className="font-body text-muted text-xs font-semibold uppercase tracking-wider px-4 py-3 text-left border-b border-border">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center font-body text-muted text-sm italic">No team members yet.</td></tr>
            ) : members.map(member => (
              <tr key={member.id} className="hover:bg-surface-2 transition-colors">
                <td className="px-4 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    {member.photo ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                        <Image src={member.photo} alt={member.name} fill sizes="96px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-xs shrink-0">
                        {getInitials(member.name)}
                      </div>
                    )}
                    <span className="font-body text-main text-sm font-medium">{member.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 border-b border-border font-body text-main text-xs">
                  {formatRole(member.role)}
                </td>
                <td className="px-4 py-4 border-b border-border font-body text-muted text-xs">
                  {member.community ? member.community.replace(/_/g, " ") : "Unassigned"}
                </td>
                <td className="px-4 py-4 border-b border-border font-body text-muted text-xs">
                  {member.displayOrder}
                </td>
                <td className="px-4 py-4 border-b border-border">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/team/${member.id}`}
                      className="p-1.5 rounded-md text-muted hover:text-primary hover:bg-surface-2 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => setConfirmDelete(member.id)}
                      className="p-1.5 rounded-md text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
