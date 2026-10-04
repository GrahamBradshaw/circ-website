"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2, Loader2, Home } from "lucide-react"
import Link from "next/link"
import { applicationSchema } from "@/lib/validators"
import { cn } from "@/lib/utils"

type ApplicationValues = z.infer<typeof applicationSchema>

interface Community {
  id: string
  name: string
  slug: string
}

interface ApplicationFormProps {
  communities: Community[]
}

export function ApplicationForm({ communities }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      communities: [],
      whyJoin: "",
      skills: "",
    }
  })

  const formCommunities = watch("communities") || [] // Ensure array
  const whyJoinText = watch("whyJoin") || ""
  const skillsText = watch("skills") || ""

  const onSubmit = async (data: ApplicationValues) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        window.gtag?.("event", "generate_lead", {
          method: "membership_application",
        })
        setIsSuccess(true)
      } else {
        const result = await response.json()
        setError(result.error || "Something went wrong. Please try again.")
      }
    } catch (err) {
      setError("Failed to submit application. Check your connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleCommunity = (slug: string) => {
    const current = [...formCommunities]
    const index = current.indexOf(slug)
    if (index > -1) {
      current.splice(index, 1)
    } else {
      current.push(slug)
    }
    setValue("communities", current, { shouldValidate: true })
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center py-16">
        <div className="w-20 h-20 text-accent-green animate-[scale-in_0.4s_ease-out] flex items-center justify-center">
            <CheckCircle2 size={80} strokeWidth={1.5} />
        </div>
        <h2 className="font-display text-primary dark:text-white text-3xl font-bold mt-6">Application Received!</h2>
        <p className="font-body text-muted dark:text-gray-400 text-base mt-3 max-w-sm">
          Thank you for applying to CIRC. Our committee will review your submission and get back to you within 7 working days.
        </p>
        <Link href="/" className="btn-outline dark:border-white/20 dark:text-white dark:hover:bg-white/10 mt-8">
          <Home size={18} className="mr-2" />
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      <h2 className="font-display text-primary dark:text-white text-3xl font-bold mb-8">Application Form</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-900/50 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" data-clarity-mask="true">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="mb-0">
            <label className="block font-body text-main dark:text-gray-200 text-sm font-medium mb-1.5">Full Name</label>
            <input 
              {...register("fullName")}
              className="w-full font-body text-main dark:text-white text-sm border border-border dark:border-white/15 rounded-lg px-4 py-3 focus:outline-none focus:border-primary dark:focus:border-accent-orange focus:ring-2 focus:ring-primary/20 transition-all bg-surface dark:bg-[#18181B] dark:placeholder-gray-500"
              placeholder="e.g. John Doe"
            />
            {errors.fullName && <p className="font-body text-red-500 text-xs mt-1.5">{errors.fullName.message}</p>}
          </div>

          <div className="mb-0">
            <label className="block font-body text-main dark:text-gray-200 text-sm font-medium mb-1.5">Student ID</label>
            <input 
              {...register("studentId")}
              className="w-full font-body text-main dark:text-white text-sm border border-border dark:border-white/15 rounded-lg px-4 py-3 focus:outline-none focus:border-primary dark:focus:border-accent-orange focus:ring-2 focus:ring-primary/20 transition-all bg-surface dark:bg-[#18181B] dark:placeholder-gray-500"
              placeholder="e.g. CIT/001/2021"
            />
            {errors.studentId && <p className="font-body text-red-500 text-xs mt-1.5">{errors.studentId.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="mb-0">
            <label className="block font-body text-main dark:text-gray-200 text-sm font-medium mb-1.5">Department</label>
            <input 
              {...register("department")}
              className="w-full font-body text-main dark:text-white text-sm border border-border dark:border-white/15 rounded-lg px-4 py-3 focus:outline-none focus:border-primary dark:focus:border-accent-orange focus:ring-2 focus:ring-primary/20 transition-all bg-surface dark:bg-[#18181B] dark:placeholder-gray-500"
              placeholder="e.g. Computing"
            />
            {errors.department && <p className="font-body text-red-500 text-xs mt-1.5">{errors.department.message}</p>}
          </div>

          <div className="mb-0">
            <label className="block font-body text-main dark:text-gray-200 text-sm font-medium mb-1.5">Year of Study</label>
            <select 
              {...register("year")}
              className="w-full font-body text-main dark:text-white text-sm border border-border dark:border-white/15 rounded-lg px-4 py-3 focus:outline-none focus:border-primary dark:focus:border-accent-orange focus:ring-2 focus:ring-primary/20 transition-all bg-surface dark:bg-[#18181B] cursor-pointer"
            >
              <option value="" className="dark:bg-[#18181B]">Select Year</option>
              <option value="1st Year" className="dark:bg-[#18181B]">1st Year</option>
              <option value="2nd Year" className="dark:bg-[#18181B]">2nd Year</option>
              <option value="3rd Year" className="dark:bg-[#18181B]">3rd Year</option>
              <option value="4th Year" className="dark:bg-[#18181B]">4th Year</option>
            </select>
            {errors.year && <p className="font-body text-red-500 text-xs mt-1.5">{errors.year.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="mb-0">
            <label className="block font-body text-main dark:text-gray-200 text-sm font-medium mb-1.5">Email Address</label>
            <input 
              {...register("email")}
              type="email"
              className="w-full font-body text-main dark:text-white text-sm border border-border dark:border-white/15 rounded-lg px-4 py-3 focus:outline-none focus:border-primary dark:focus:border-accent-orange focus:ring-2 focus:ring-primary/20 transition-all bg-surface dark:bg-[#18181B] dark:placeholder-gray-500"
              placeholder="email@example.com"
            />
            {errors.email && <p className="font-body text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
          </div>

          <div className="mb-0">
            <label className="block font-body text-main dark:text-gray-200 text-sm font-medium mb-1.5">Phone Number</label>
            <input 
              {...register("phone")}
              type="tel"
              className="w-full font-body text-main dark:text-white text-sm border border-border dark:border-white/15 rounded-lg px-4 py-3 focus:outline-none focus:border-primary dark:focus:border-accent-orange focus:ring-2 focus:ring-primary/20 transition-all bg-surface dark:bg-[#18181B] dark:placeholder-gray-500"
              placeholder="0712 345 678"
            />
            {errors.phone && <p className="font-body text-red-500 text-xs mt-1.5">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="mb-5">
          <label className="block font-body text-main dark:text-gray-200 text-sm font-medium mb-1.5">Communities of Interest</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {communities.map((c) => (
              <label 
                key={c.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border border-border dark:border-white/15 hover:border-primary dark:hover:border-accent-orange cursor-pointer transition-colors",
                  formCommunities.includes(c.slug) && "border-primary dark:border-accent-orange bg-surface-2 dark:bg-[#1E1E24]"
                )}
              >
                <input 
                  type="checkbox"
                  className="hidden"
                  checked={formCommunities.includes(c.slug)}
                  onChange={() => toggleCommunity(c.slug)}
                />
                <div className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center transition-all",
                  formCommunities.includes(c.slug) ? "bg-primary dark:bg-accent-orange border-primary dark:border-accent-orange" : "bg-white dark:bg-[#18181B] border-border dark:border-white/20"
                )}>
                  {formCommunities.includes(c.slug) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <span className="font-body text-main dark:text-gray-200 text-sm cursor-pointer">{c.name}</span>
              </label>
            ))}
          </div>
          {errors.communities && <p className="font-body text-red-500 text-xs mt-1.5">{errors.communities.message}</p>}
        </div>

        <div className="mb-5">
          <label className="block font-body text-main dark:text-gray-200 text-sm font-medium mb-1.5">Why do you want to join CIRC?</label>
          <textarea 
            {...register("whyJoin")}
            rows={4}
            className="w-full font-body text-main dark:text-white text-sm border border-border dark:border-white/15 rounded-lg px-4 py-3 focus:outline-none focus:border-primary dark:focus:border-accent-orange focus:ring-2 focus:ring-primary/20 transition-all bg-surface dark:bg-[#18181B] dark:placeholder-gray-500 resize-none"
            placeholder="Tell us about your motivation..."
          />
          <div className="flex justify-between items-center mt-1.5">
            {errors.whyJoin ? (
              <p className="font-body text-red-500 text-xs flex items-center gap-1">
                {errors.whyJoin.message}
              </p>
            ) : <div />}
            <span className={cn(
              "font-body text-xs tabular-nums",
              whyJoinText.length >= 50 ? "text-accent-green" : "text-red-400"
            )}>
              {whyJoinText.length} / 50 characters
            </span>
          </div>
        </div>

        <div className="mb-5">
          <label className="block font-body text-main dark:text-gray-200 text-sm font-medium mb-1.5">What technical skills do you have?</label>
          <textarea 
            {...register("skills")}
            rows={3}
            className="w-full font-body text-main dark:text-white text-sm border border-border dark:border-white/15 rounded-lg px-4 py-3 focus:outline-none focus:border-primary dark:focus:border-accent-orange focus:ring-2 focus:ring-primary/20 transition-all bg-surface dark:bg-[#18181B] dark:placeholder-gray-500 resize-none"
            placeholder="Languages, frameworks, previous projects..."
          />
          <div className="flex justify-between items-center mt-1.5">
            {errors.skills ? (
              <p className="font-body text-red-500 text-xs flex items-center gap-1">
                {errors.skills.message}
              </p>
            ) : <div />}
            <span className={cn(
              "font-body text-xs tabular-nums",
              skillsText.length >= 30 ? "text-accent-green" : "text-red-400"
            )}>
              {skillsText.length} / 30 characters
            </span>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="btn-primary-lg w-full justify-center mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Membership Application"
          )}
        </button>
      </form>
    </div>
  )
}
