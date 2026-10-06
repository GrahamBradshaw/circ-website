// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getPublicCached, invalidatePublicContentCache } from "@/lib/redis-cache"
import { successResponse, errorResponse } from "@/lib/api"
import { requireAdmin } from "@/lib/auth"
import { gallerySchema } from "@/lib/validators"
import { revalidatePath } from "next/cache"
import { notifyIndexNow } from "@/lib/indexnow"

// This function GET handles the main work in this file and explains what this logic is doing in simple English.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get("eventId")
    const skip = Math.max(0, Number.parseInt(searchParams.get("skip") ?? "0", 10) || 0)
    const requestedLimit = Number.parseInt(searchParams.get("limit") ?? "24", 10) || 24
    const limit = Math.min(48, Math.max(1, requestedLimit))

    const page = await getPublicCached(`api:gallery:${eventId ?? "all"}:${skip}:${limit}`, async () => {
      const rows = await prisma.galleryImage.findMany({
        where: eventId ? { eventId } : undefined,
        include: { event: { select: { id: true, title: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit + 1,
      })
      return { images: rows.slice(0, limit), hasMore: rows.length > limit }
    }, { images: [], hasMore: false })

    return NextResponse.json(
      { success: true, data: page.images, pagination: { skip, limit, hasMore: page.hasMore } },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
    )
  } catch (err) {
    console.error("Gallery API error:", err)
    return NextResponse.json({ success: false, error: "Failed to load gallery" }, { status: 500 })
  }
}

// This function POST handles the main work in this file and explains what this logic is doing in simple English.
export async function POST(req: Request) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const body = await req.json()
    const { url, caption, eventId } = body

    if (!url) {
      return NextResponse.json({ success: false, error: "Image URL required" }, { status: 400 })
    }

    const image = await prisma.galleryImage.create({
      data: { url, caption: caption || null, eventId: eventId || null },
    })
    await invalidatePublicContentCache()

    revalidatePath("/gallery")
    await notifyIndexNow(["/gallery"])
    return NextResponse.json({ success: true, data: image }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Failed to save image" }, { status: 500 })
  }
}
