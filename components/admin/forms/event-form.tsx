// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { eventSchema } from "@/lib/validators"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { ImageUploader } from "@/components/admin/image-uploader"
import { Loader2, Save, Calendar, MapPin, Tag, Globe, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

type EventValues = z.input<typeof eventSchema>

interface EventFormProps {
  event?: any
}

const inputClass = "w-full font-body text-sm border border-border rounded-lg px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-surface"
const labelClass = "text-[10px] font-bold text-muted uppercase tracking-widest pl-1 mb-1.5 block"
const sectionClass = "bg-surface rounded-xl border border-border p-6"

// This function EventForm handles the main work in this file and explains what this logic is doing in simple English.
export function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title ?? "",
      description: event?.description ?? "",
      date: event?.date ? new Date(event.date).toISOString().slice(0, 16) : "",
      venue: event?.venue ?? "",
      type: event?.type ?? "",
      coverImage: event?.coverImage ?? "",
      regLink: event?.regLink ?? "",
      published: event?.published ?? false,
    }
  })

  const description = watch("description")
  const coverImage = watch("coverImage")
  const published = watch("published")

  async function onSubmit(data: EventValues) {
    setIsSubmitting(true)
    setToast(null)

    try {
      const payload = {
        title: data.title,
        description: data.description,
        date: new Date(data.date as string | Date).toISOString(),
        venue: data.venue,
        type: data.type,
        coverImage: data.coverImage,
        regLink: data.regLink || null,
        published: data.published,
      }

      const url = event ? `/api/events/${event.id}` : "/api/events"
      const method = event ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (!result.success) throw new Error(result.error || "Failed to save event")

      setToast({ msg: event ? "Event updated successfully" : "Event created successfully", type: "success" })
      
      setTimeout(() => {
        window.location.href = "/admin/events"
      }, 1200)
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
      {/* Publish Status Banner */}
      <div className={cn(
        "p-4 rounded-xl border flex items-center justify-between",
        published ? "bg-green-50 border-green-100 text-green-800" : "bg-surface-2 border-border text-muted"
      )}>
        <div className="flex items-center gap-3">
          {published ? <Eye size={18} className="text-accent-green" /> : <EyeOff size={18} className="text-muted" />}
          <div>
            <p className="font-body text-sm font-bold">
              {published ? "Event is published and live" : "Draft. Visible to admins only."}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setValue("published", !published)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
            published ? "bg-accent-green" : "bg-border"
          )}
        >
          <span className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            published ? "translate-x-6" : "translate-x-1"
          )} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <div className={sectionClass}>
            <h3 className="font-display text-primary text-lg font-semibold mb-5">Event Information</h3>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Event Title</label>
                <input 
                  {...register("title")}
                  className={cn(inputClass, errors.title && "border-red-400 focus:border-red-500 focus:ring-red-200")}
                  placeholder="e.g. Next.js Masterclass Hackathon"
                />
                {errors.title && <p className="text-[11px] text-red-500 font-bold pl-1 mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Description & Content</label>
                <RichTextEditor 
                  value={description}
                  onChange={(val) => setValue("description", val, { shouldValidate: true })}
                />
                {errors.description && <p className="text-[11px] text-red-500 font-bold pl-1 mt-1">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          {/* Logistics */}
          <div className={sectionClass}>
            <h3 className="font-display text-primary text-lg font-semibold mb-5 flex items-center gap-2">
              <Globe size={18} className="text-primary" /> Logistics & Metadata
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Date & Time</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3 top-3.5 text-muted pointer-events-none" />
                  <input 
                    {...register("date")}
                    type="datetime-local"
                    className={cn(inputClass, "pl-9")}
                  />
                </div>
                {errors.date && <p className="text-[11px] text-red-500 font-bold pl-1 mt-1">{errors.date.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Venue / Location</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-3.5 text-muted pointer-events-none" />
                  <input 
                    {...register("venue")}
                    className={cn(inputClass, "pl-9")}
                    placeholder="e.g. Block C, Room 102 / Google Meet"
                  />
                </div>
                {errors.venue && <p className="text-[11px] text-red-500 font-bold pl-1 mt-1">{errors.venue.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Category / Type</label>
                <div className="relative">
                  <Tag size={15} className="absolute left-3 top-3.5 text-muted pointer-events-none" />
                  <select 
                    {...register("type")}
                    className={cn(inputClass, "pl-9 appearance-none")}
                  >
                    <option value="">Select event type</option>
                    <option value="HACKATHON">Hackathon</option>
                    <option value="WORKSHOP">Workshop</option>
                    <option value="TALK">Talk / Seminar</option>
                    <option value="MENTORSHIP">Mentorship</option>
                    <option value="RESEARCH">Research</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Registration Link</label>
                <input 
                  {...register("regLink")}
                  className={inputClass}
                  placeholder="https://forms.gle/..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className={cn(sectionClass, "sticky top-24")}>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Cover Image</label>
                <ImageUploader 
                  value={coverImage}
                  onChange={(url) => setValue("coverImage", url, { shouldValidate: true })}
                />
                {errors.coverImage && <p className="text-[11px] text-red-500 font-bold pl-1 mt-1">{errors.coverImage.message}</p>}
              </div>

              <div className="pt-4 border-t border-border space-y-3">

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {event ? "Save Changes" : "Create Event"}
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
        </div>
      </div>
    </form>
  )
}
