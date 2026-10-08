// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getPublicCached, invalidatePublicContentCache } from "@/lib/redis-cache"
import { publicSuccessResponse, successResponse, errorResponse } from "@/lib/api"
import { requireAdmin } from "@/lib/auth"
import { eventSchema } from "@/lib/validators"
import { notifyIndexNow } from "@/lib/indexnow"
import { sanitizeRichText } from "@/lib/sanitize"

// This function GET handles the main work in this file and explains what this logic is doing in simple English.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const all = searchParams.get("all") === "true"

    if (all) {
      const { error } = await requireAdmin()
      if (error) return error
      const events = await prisma.event.findMany({
        orderBy: { date: "asc" },
        include: { gallery: true },
      })
      return successResponse(events)
    }

    const events = await getPublicCached("api:events:published", () => prisma.event.findMany({
      where: { published: true },
      orderBy: { date: "asc" },
      select: { id: true, title: true },
    }), [])
    return publicSuccessResponse(events)
  } catch (error: any) {
    const status = error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500
    return errorResponse(error.message, status)
  }
}

// This function POST handles the main work in this file and explains what this logic is doing in simple English.
export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    const body = await req.json()
    const validatedData = eventSchema.parse({
      ...body,
      description: sanitizeRichText(body.description ?? ""),
    })

    const event = await prisma.event.create({
      data: validatedData,
    })
    await invalidatePublicContentCache()

    revalidatePath("/events")
    revalidatePath("/")
    await notifyIndexNow(["/", "/events", `/events/${encodeURIComponent(event.id)}`])

    return successResponse(event, 201)
  } catch (error: any) {
    return errorResponse(error.message, error.name === "ZodError" ? 400 : 500)
  }
}
