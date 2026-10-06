// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ImageUploader } from "@/components/admin/image-uploader"
import { Save, Plus, X, User, Layers, Info, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface CommunityFormProps {
  community: any
  teamMembers: any[]
}

// This function CommunityForm handles the main work in this file and explains what this logic is doing in simple English.
export function CommunityForm({ community, teamMembers }: CommunityFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null)

  // Local state for flexible lists
  const [description, setDescription] = useState(community.description)
  const [leadId, setLeadId] = useState(community.leadId || "")
  const [heroImage, setHeroImage] = useState(community.heroImage || "")
  const [focusTags, setFocusTags] = useState<string[]>(community.focusTags || [])
  const [activities, setActivities] = useState<string[]>(community.activities || [])
  
  // Temporary input state
  const [tagInput, setTagInput] = useState("")
  const [activityInput, setActivityInput] = useState("")

  const addTag = () => {
    if (tagInput && !focusTags.includes(tagInput)) {
      setFocusTags([...focusTags, tagInput])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setFocusTags(focusTags.filter(t => t !== tag))
  }

  const addActivity = () => {
    if (activityInput.trim()) {
      setActivities([...activities, activityInput.trim()])
      setActivityInput("")
    }
  }

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index))
  }

  async function onSave() {
    setIsSubmitting(true)
    setToast(null)

    try {
      const payload = {
        description,
        leadId: leadId || null,
        heroImage,
        focusTags,
        activities,
      }

      const res = await fetch(`/api/communities/${community.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (!result.success) throw new Error(result.error || "Failed to save changes")

      setToast({ msg: "Community saved successfully", type: "success" })
      
      setTimeout(() => {
        window.location.href = "/admin/communities"
      }, 1200)
    } catch (err: any) {
      setToast({ msg: err.message || "Something went wrong", type: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-12 pb-24">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 font-body text-sm px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-accent-green text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Core Info */}
          <section className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm">
            <h3 className="text-sm font-display font-bold text-primary-dark mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary-main" /> Community Backbone
            </h3>
            
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-primary-dark uppercase tracking-widest pl-1">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-satoshi focus:outline-none focus:ring-4 focus:ring-primary-main/5 transition-all resize-none"
                placeholder="What defines this community? Tell its mission..."
              />
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-bold text-primary-dark uppercase tracking-widest pl-1">Focus Areas / Tags</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {focusTags.map(tag => (
                  <span key={tag} className="flex items-center gap-2 px-3 py-1 bg-primary-main/5 border border-primary-main/10 text-primary-main rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-satoshi focus:outline-none focus:ring-4 focus:ring-primary-main/5 transition-all"
                  placeholder="Type a tag (e.g. Next.js) and press Enter..."
                />
                <button 
                  onClick={addTag}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
                >
                  Add
                </button>
              </div>
            </div>
          </section>

          {/* Activities List */}
          <section className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-display font-bold text-primary-dark flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary-main" /> Key Activities
              </h3>
            </div>
            
            <div className="space-y-3">
              {activities.map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-100 rounded-xl group">
                  <span className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-50">
                    {i + 1}
                  </span>
                  <p className="flex-1 text-xs font-satoshi font-medium text-primary-dark">{activity}</p>
                  <button onClick={() => removeActivity(i)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2 pt-4">
                <input 
                  value={activityInput}
                  onChange={(e) => setActivityInput(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-satoshi focus:outline-none focus:ring-4 focus:ring-primary-main/5 transition-all"
                  placeholder="Describe a regular activity..."
                />
                <button 
                  onClick={addActivity}
                  className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Lead & Hero */}
        <div className="space-y-8">
          <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8">
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-primary-dark uppercase tracking-widest pl-1 flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Community Lead
              </label>
              <select 
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-primary-dark focus:outline-none focus:ring-4 focus:ring-primary-main/5 transition-all cursor-pointer"
              >
                <option value="">No Lead Assigned</option>
                {teamMembers.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-bold text-primary-dark uppercase tracking-widest pl-1">Representative Hero</label>
              <ImageUploader 
                value={heroImage}
                onChange={setHeroImage}
              />
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-4">

              <button 
                onClick={onSave}
                disabled={isSubmitting}
                className="w-full bg-primary-dark hover:bg-black text-white py-4 rounded-xl font-display font-bold text-sm tracking-wide shadow-xl shadow-primary-dark/10 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:bg-slate-300"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Confirm Configuration
              </button>
              <div className="bg-slate-50 p-4 rounded-2xl flex items-start gap-3">
                <Info className="w-4 h-4 text-primary-main mt-0.5" />
                <p className="text-[10px] text-muted-main leading-relaxed font-bold uppercase tracking-tight">
                  Configuring this community updates its public landing page, including hero banners and activity blocks.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
