import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getPublicCached, invalidatePublicContentCache } from "@/lib/redis-cache"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { publicSuccessResponse } from "@/lib/api"

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const community = await getPublicCached(`api:community:${slug}`, () => prisma.community.findUnique({ where: { slug } }), null)
    if (!community) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })
    return publicSuccessResponse(community)
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { error } = await requireAdmin()
    if (error) return error

    const body = await req.json()

    // If leadId is empty string, set to null
    if (body.leadId === "") body.leadId = null

    const community = await prisma.community.update({
      where: { slug },
      data: {
        description: body.description,
        focusTags: body.focusTags,
        heroImage: body.heroImage ?? null,
        leadId: body.leadId ?? null,
        activities: body.activities ?? [],
      },
    })
    await invalidatePublicContentCache()

    revalidatePath("/communities")
    revalidatePath(`/communities/${slug}`)
    revalidatePath("/join")
    revalidatePath("/")

    return NextResponse.json({ success: true, data: community })
  } catch (err: any) {
    console.error("PATCH community error:", err)
    if (err.message === "Unauthorized" || err.message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ success: false, error: "Failed to update community" }, { status: 500 })
  }
}
