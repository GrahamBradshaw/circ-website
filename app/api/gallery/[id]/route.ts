// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { invalidatePublicContentCache } from "@/lib/redis-cache"
import { successResponse, errorResponse } from "@/lib/api"
import { requireAdmin } from "@/lib/auth"
import { notifyIndexNow } from "@/lib/indexnow"

// This function PATCH handles the main work in this file and explains what this logic is doing in simple English.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const { id } = await params
    const body = await req.json()
    const image = await prisma.galleryImage.update({
      where: { id },
      data: { caption: body.caption ?? null, eventId: body.eventId || null },
    })
    await invalidatePublicContentCache()
    revalidatePath("/gallery")
    await notifyIndexNow(["/gallery"])
    return NextResponse.json({ success: true, data: image })
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 })
  }
}

// This function DELETE handles the main work in this file and explains what this logic is doing in simple English.
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const { id } = await params
    await prisma.galleryImage.delete({ where: { id } })
    await invalidatePublicContentCache()
    revalidatePath("/gallery")
    await notifyIndexNow(["/gallery"])
    return NextResponse.json({ success: true, message: "Gallery image deleted successfully" })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Delete failed" }, { status: 500 })
  }
}
