// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { prisma } from "@/lib/prisma"
import { getPublicCached, invalidatePublicContentCache } from "@/lib/redis-cache"
import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { publicSuccessResponse } from "@/lib/api"
import { notifyIndexNow } from "@/lib/indexnow"

// This function GET handles the main work in this file and explains what this logic is doing in simple English.
export async function GET() {
  try {
    const settings = await getPublicCached("api:settings:singleton", async () => {
      let current = await prisma.settings.findUnique({ where: { id: "singleton" } })
      if (!current) current = await prisma.settings.create({ data: { id: "singleton" } })
      return current
    }, null)
    return publicSuccessResponse(settings)
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 })
  }
}

// This function PATCH handles the main work in this file and explains what this logic is doing in simple English.
export async function PATCH(req: Request) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    const body = await req.json()
    const settings = await prisma.settings.upsert({
      where: { id: "singleton" },
      update: body,
      create: { id: "singleton", ...body },
    })
    await invalidatePublicContentCache()
    revalidatePath("/")
    revalidatePath("/communities")
    revalidatePath("/events")
    revalidatePath("/team")
    revalidatePath("/gallery")
    revalidatePath("/join")
    revalidatePath("/contact")
    await notifyIndexNow(["/", "/communities", "/events", "/team", "/gallery", "/join", "/contact"])
    return NextResponse.json({ success: true, data: settings })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "Failed to save settings" }, { status: 500 })
  }
}
