// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { teamMemberSchema } from "@/lib/validators"
import { ImageUploader } from "@/components/admin/image-uploader"
import { Loader2, Save, Users, Briefcase, Github, Linkedin, Twitter } from "lucide-react"
import { cn } from "@/lib/utils"

interface TeamValues {
  name: string
  role: string
  community: string | null
  bio: string
  photo: string
  linkedin: string | null
  github: string | null
  twitter: string | null
  displayOrder: number
}

interface TeamFormProps {
  member?: {
    id: string
    name: string
    role: string
    community: string | null
    bio: string
    photo: string
    linkedin: string | null
    github: string | null
    twitter: string | null
    displayOrder: number
  }
}

const roles = ["CHAIRPERSON", "VICE_CHAIRPERSON", "SECRETARY", "TREASURER", "EVENT_ORGANIZER", "COMMUNITY_LEAD", "COMMUNITY_CO_LEADER"]
const communities = ["WEB_DEV", "DATA_SCIENCE", "AI_ML", "WEB3_BLOCKCHAIN", "PROGRAMMING", "IOT", "NETWORKING_CYBERSECURITY"]

const inputClass = "w-full font-body text-sm text-main placeholder:text-muted border border-border rounded-lg px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-surface"
const labelClass = "text-[10px] font-bold text-muted uppercase tracking-widest pl-1 mb-1.5 block"
const sectionClass = "bg-surface rounded-xl border border-border p-6"

// This function TeamForm handles the main work in this file and explains what this logic is doing in simple English.
export function TeamForm({ member }: TeamFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TeamValues>({
    resolver: zodResolver(teamMemberSchema) as any,
    defaultValues: {
      name: member?.name ?? "",
      role: (member?.role as any) ?? "COMMUNITY_LEAD",
      community: (member?.community as any) ?? "NONE",
      bio: member?.bio ?? "",
      photo: member?.photo ?? "",
      linkedin: member?.linkedin ?? "",
      github: member?.github ?? "",
      twitter: member?.twitter ?? "",
      displayOrder: member?.displayOrder ?? 0,
    }
  })

  const role = watch("role")
  const photo = watch("photo")

  async function onSubmit(data: any) {
    setIsSubmitting(true)
    setToast(null)

    try {
      const communityValue = (data.community && data.community !== "NONE") ? data.community : null
      const payload = {
        name: data.name,
        role: data.role as string,
        community: communityValue,
        bio: data.bio,
        photo: data.photo,
        linkedin: data.linkedin || null,
        github: data.github || null,
        twitter: data.twitter || null,
        displayOrder: Number(data.displayOrder) || 0,
      }

      const url = member ? `/api/team/${member.id}` : "/api/team"
      const method = member ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      if (!result.success) throw new Error(result.error || "Failed to save member")

      setToast({ msg: member ? "Member updated" : "Member added successfully", type: "success" })
      setTimeout(() => { window.location.href = "/admin/team" }, 1200)
    } catch (err: any) {
      setToast({ msg: err.message || "Something went wrong", type: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 font-body text-sm px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-accent-green text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Identity & Role */}
          <div className={sectionClass}>
            <h3 className="font-display text-primary text-lg font-semibold mb-5 flex items-center gap-2">
              <Users size={18} /> Identity & Role
            </h3>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Full Name</label>
                <input 
                  {...register("name")}
                  className={cn(inputClass, errors.name && "border-red-400")}
                  placeholder="e.g. Jane Smith"
                />
                {errors.name && <p className="text-[11px] text-red-500 font-bold pl-1 mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Board Role</label>
                  <select 
                    {...register("role")}
                    className={cn(inputClass, "appearance-none")}
                  >
                    {roles.map(r => <option key={r} value={r}>{r === "COMMUNITY_CO_LEADER" ? "Community Co-Leader" : r.replace(/_/g, " ")}</option>)}
                  </select>
                </div>

                {(role === "COMMUNITY_LEAD" || role === "COMMUNITY_CO_LEADER") && (
                  <div>
                    <label className={labelClass}>Assigned Community</label>
                    <select 
                      {...register("community")}
                      className={cn(inputClass, "appearance-none")}
                    >
                      <option value="NONE">Select a community...</option>
                      {communities.map(c => <option key={c} value={c}>{c === "NETWORKING_CYBERSECURITY" ? "Networking and Cybersecurity" : c.replace(/_/g, " ")}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>Short Biography</label>
                <textarea 
                  {...register("bio")}
                  rows={4}
                  className={cn(inputClass, "resize-none")}
                  placeholder="A brief intro about the member's background and club contribution..."
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className={sectionClass}>
            <h3 className="font-display text-primary text-lg font-semibold mb-5 flex items-center gap-2">
              <Briefcase size={18} /> Social Presence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={cn(labelClass, "flex items-center gap-1.5")}><Linkedin size={12} /> LinkedIn</label>
                <input 
                  {...register("linkedin")}
                  className={inputClass}
                  placeholder="https://linkedin.com/..."
                />
              </div>
              <div>
                <label className={cn(labelClass, "flex items-center gap-1.5")}><Github size={12} /> GitHub</label>
                <input 
                  {...register("github")}
                  className={inputClass}
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className={cn(labelClass, "flex items-center gap-1.5")}><Twitter size={12} /> Twitter / X</label>
                <input 
                  {...register("twitter")}
                  className={inputClass}
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Photo & Actions */}
        <div className={cn(sectionClass, "sticky top-24 space-y-5 h-fit")}>
          <div>
            <label className={labelClass}>Profile Photo</label>
            <ImageUploader 
              value={photo}
              onChange={(url) => setValue("photo", url, { shouldValidate: true })}
            />
            {errors.photo && <p className="text-[11px] text-red-500 font-bold pl-1 mt-1">{errors.photo.message}</p>}
          </div>

          <div>
            <label className={cn(labelClass, "flex items-center justify-between")}>
              Display Order
              <span className="text-[9px] lowercase opacity-50">(lower = first)</span>
            </label>
            <input 
              {...register("displayOrder", { valueAsNumber: true })}
              type="number"
              className={inputClass}
            />
          </div>

          <div className="pt-4 border-t border-border space-y-3">

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {member ? "Save Changes" : "Create Member"}
            </button>
            <button 
              type="button"
              onClick={() => router.back()}
              className="w-full btn-outline text-sm"
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
