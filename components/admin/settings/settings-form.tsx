// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Mail, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Github, 
  Save, 
  Loader2,
  CheckCircle2,
  Globe,
  Shield,
  FileText
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SettingsFormProps {
  initialData: any
}

// This function SettingsForm handles the main work in this file and explains what this logic is doing in simple English.
export function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null)
  
  const [formData, setFormData] = useState({
    contactEmail: initialData.contactEmail || "",
    linkedin: initialData.linkedin || "",
    twitter: initialData.twitter || "",
    instagram: initialData.instagram || "",
    github: initialData.github || "",
    aboutText: initialData.aboutText || "",
    maintenance: initialData.maintenance || false,
  })

  const onSave = async () => {
    setIsSubmitting(true)
    setToast(null)
    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setToast({ msg: "Settings saved successfully", type: "success" })
        router.refresh()
      } else {
        setToast({ msg: "Failed to save settings", type: "error" })
      }
    } catch (err) {
      console.error(err)
      setToast({ msg: "Something went wrong", type: "error" })
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setToast(null), 3500)
    }
  }

  const inputClass = "w-full font-body text-sm border border-border rounded-lg px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-surface"
  const labelClass = "text-[10px] font-bold text-muted uppercase tracking-widest pl-1 mb-1.5 block"

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 font-body text-sm px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-accent-green text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}
      {/* Contact Group */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <h3 className="font-display text-primary text-lg font-semibold mb-5 flex items-center gap-2">
          <Mail size={20} className="text-accent-orange" /> Contact Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Primary Contact Email</label>
            <input 
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className={inputClass}
              placeholder="hello@circ.com"
            />
          </div>
        </div>
      </div>

      {/* Social Links Group */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <h3 className="font-display text-primary text-lg font-semibold mb-5 flex items-center gap-2">
          <Globe size={20} className="text-accent-sky" /> Social Connectivity
        </h3>
        <p className="font-body text-muted text-xs -mt-3 mb-5">
          Add CIRC’s official profile address for each platform. Full URLs and addresses without https:// are supported.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>LinkedIn</label>
            <div className="relative">
              <Linkedin size={14} className="absolute left-3 top-3.5 text-muted" />
              <input 
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className={cn(inputClass, "pl-9")}
                placeholder="linkedin.com/company/..."
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>GitHub</label>
            <div className="relative">
              <Github size={14} className="absolute left-3 top-3.5 text-muted" />
              <input 
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className={cn(inputClass, "pl-9")}
                placeholder="github.com/..."
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Twitter / X</label>
            <div className="relative">
              <Twitter size={14} className="absolute left-3 top-3.5 text-muted" />
              <input 
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                className={cn(inputClass, "pl-9")}
                placeholder="twitter.com/..."
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Instagram</label>
            <div className="relative">
              <Instagram size={14} className="absolute left-3 top-3.5 text-muted" />
              <input 
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className={cn(inputClass, "pl-9")}
                placeholder="instagram.com/..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* About Group */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <h3 className="font-display text-primary text-lg font-semibold mb-5 flex items-center gap-2">
          <FileText size={20} className="text-primary" /> About Club
        </h3>
        <div>
          <label className={labelClass}>About Text (Footer)</label>
          <textarea 
            value={formData.aboutText}
            onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
            rows={4}
            className={cn(inputClass, "resize-none")}
            placeholder="A short description of the club..."
          />
        </div>
      </div>

      {/* Maintenance Group */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <h3 className="font-display text-primary text-lg font-semibold mb-5 flex items-center gap-2">
          <Shield size={20} className="text-red-500" /> System Integrity
        </h3>
        <div className="flex items-center justify-between p-4 bg-surface-2 rounded-lg border border-border">
          <div>
            <p className="font-body text-main text-sm font-medium">Maintenance Mode</p>
            <p className="font-body text-muted text-xs mt-0.5">Disable public access temporarily</p>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, maintenance: !formData.maintenance })}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
              formData.maintenance ? "bg-accent-orange" : "bg-border"
            )}
          >
            <span className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              formData.maintenance ? "translate-x-6" : "translate-x-1"
            )} />
          </button>
        </div>
      </div>

      {/* Save Button & Feedback */}
      <div className="flex items-center gap-4 pt-2">
        <button 
          onClick={onSave}
          disabled={isSubmitting}
          className="btn-primary flex items-center gap-2 min-w-[160px]"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Changes
        </button>


      </div>
    </div>
  )
}
