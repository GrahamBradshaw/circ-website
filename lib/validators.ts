// This file is part of the CIRC website.
// It belongs to the library layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { z } from "zod"
import { sanitizeRichText } from "@/lib/sanitize"

// These schemas are used to validate form input before it is saved to the database.
// They help catch bad values like empty fields, invalid URLs, or missing required data.
// This constant eventSchema stores shared values used by this file so the logic stays easier to follow.
export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().transform((value) => sanitizeRichText(value)).refine((value) => value.length > 0, "Description is required"),
  date: z.coerce.date(),
  venue: z.string().min(1, "Venue is required"),
  type: z.enum(["HACKATHON", "WORKSHOP", "TALK", "MENTORSHIP", "RESEARCH", "OTHER"]),
  coverImage: z.string().url("Valid cover image URL is required"),
  regLink: z.string().url("Valid registration link is required").nullish().or(z.literal("")),
  published: z.boolean().default(false),
})

// This constant teamMemberSchema stores shared values used by this file so the logic stays easier to follow.
export const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.enum(["CHAIRPERSON", "VICE_CHAIRPERSON", "SECRETARY", "TREASURER", "EVENT_ORGANIZER", "COMMUNITY_LEAD", "COMMUNITY_CO_LEADER"]),
  community: z.preprocess(
    (val) => (val === "NONE" || val === "" || val === undefined ? null : val),
    z.enum(["WEB_DEV", "DATA_SCIENCE", "AI_ML", "WEB3_BLOCKCHAIN", "PROGRAMMING", "IOT", "NETWORKING_CYBERSECURITY"]).nullable()
  ),
  bio: z.string().min(1, "Bio is required"),
  photo: z.string().url("Valid photo URL is required"),
  linkedin: z.preprocess((val) => (val === "" ? null : val), z.string().url("Valid LinkedIn URL").nullable().optional()),
  github: z.preprocess((val) => (val === "" ? null : val), z.string().url("Valid GitHub URL").nullable().optional()),
  twitter: z.preprocess((val) => (val === "" ? null : val), z.string().url("Valid Twitter URL").nullable().optional()),
  displayOrder: z.number().int().default(0),
})

// This constant applicationSchema stores shared values used by this file so the logic stays easier to follow.
export const applicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  studentId: z.string().min(1, "Student ID is required"),
  department: z.string().min(1, "Department is required"),
  year: z.string().min(1, "Year is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  communities: z.array(z.string()).min(1, "Select at least one community"),
  whyJoin: z.string().min(50, "At least 50 characters required"),
  skills: z.string().min(30, "At least 30 characters required"),
})

// This constant gallerySchema stores shared values used by this file so the logic stays easier to follow.
export const gallerySchema = z.object({
  url: z.string().url("Valid image URL is required"),
  caption: z.string().optional(),
  eventId: z.string().optional().nullable(),
})

// This constant settingsSchema stores shared values used by this file so the logic stays easier to follow.
export const settingsSchema = z.object({
  clubName: z.string().min(1, "Club name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  instagram: z.string().url().optional().nullable(),
  linkedin: z.string().url().optional().nullable(),
  twitter: z.string().url().optional().nullable(),
  registrationOpen: z.boolean().default(true),
})
