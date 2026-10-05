import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { invalidatePublicContentCache } from "@/lib/redis-cache"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { notifyIndexNow } from "@/lib/indexnow"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const event = await prisma.event.findUnique({ where: { id } })
    if (!event) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })
    return NextResponse.json({ success: true, data: event })
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await requireAdmin()
    if (error) return error

    const body = await req.json()

    // Convert date string to Date object if present
    if (body.date && typeof body.date === "string") {
      body.date = new Date(body.date)
    }

    const event = await prisma.event.update({
      where: { id },
      data: body,
    })
    await invalidatePublicContentCache()

    revalidatePath("/events")
    revalidatePath(`/events/${id}`)
    revalidatePath("/")
    revalidatePath("/admin/events")
    await notifyIndexNow(["/", "/events", `/events/${encodeURIComponent(id)}`])

    return NextResponse.json({ success: true, data: event })
  } catch (err: any) {
    console.error("PATCH event error:", err)
    if (err.message === "Unauthorized" || err.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ success: false, error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await requireAdmin()
    if (error) return error

    await prisma.event.delete({ where: { id } })
    await invalidatePublicContentCache()

    revalidatePath("/events")
    revalidatePath("/")
    revalidatePath("/admin/events")
    await notifyIndexNow(["/", "/events", `/events/${encodeURIComponent(id)}`])

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("DELETE event error:", err)
    if (err.message === "Unauthorized" || err.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ success: false, error: "Failed to delete event" }, { status: 500 })
  }
}
