// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Edit2, Trash2, Loader2, UserCircle } from "lucide-react"

interface TeamTableProps {
  initialMembers: any[]
}

// This function TeamTable handles the main work in this file and explains what this logic is doing in simple English.
export function TeamTable({ initialMembers }: TeamTableProps) {
  const router = useRouter()
  const [members, setMembers] = useState(initialMembers)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const deleteMember = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this team member?")) return
    
    setLoadingId(id)
    try {
      const response = await fetch(`/api/team/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMembers(members.filter(m => m.id !== id))
        router.refresh()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-muted-main uppercase tracking-[.25em]">Identity</th>
              <th className="px-6 py-4 text-[10px] font-bold text-muted-main uppercase tracking-[.25em]">Role & Specialization</th>
              <th className="px-6 py-4 text-[10px] font-bold text-muted-main uppercase tracking-[.25em]">Order</th>
              <th className="px-6 py-4 text-[10px] font-bold text-muted-main uppercase tracking-[.25em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member) => (
              <tr key={member.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                      {member.photo ? (
                        <Image src={member.photo} alt={member.name} fill sizes="96px" className="object-cover" />
                      ) : (
                        <UserCircle className="w-full h-full text-slate-300" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary-dark">{member.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-bold text-accent-orange uppercase tracking-widest">{member.role.replace(/_/g, " ")}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs font-satoshi text-muted-main line-clamp-1">{member.bio || "No bio provided"}</p>
                  {member.community && member.community !== "NONE" && (
                    <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[8px] font-bold tracking-widest mt-1 border border-blue-100">
                      {member.community.replace(/_/g, " ")}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-mono font-bold text-slate-400">#{member.displayOrder}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      href={`/admin/team/${member.id}`}
                      className="p-2 rounded-lg text-slate-400 hover:text-primary-main hover:bg-primary-main/10 transition-all border border-transparent hover:border-primary-main/20"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => deleteMember(member.id)}
                      disabled={loadingId === member.id}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                    >
                      {loadingId === member.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-sm font-satoshi text-muted-main italic">
                  No team members added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
