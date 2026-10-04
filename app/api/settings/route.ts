import { prisma } from "@/lib/prisma"
import { getPublicCached, invalidatePublicContentCache } from "@/lib/redis-cache"
import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { publicSuccessResponse } from "@/lib/api"

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
    return NextResponse.json({ success: true, data: settings })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "Failed to save settings" }, { status: 500 })
  }
}
