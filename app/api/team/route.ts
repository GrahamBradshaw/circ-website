import { NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getPublicCached, invalidatePublicContentCache } from "@/lib/redis-cache"
import { publicSuccessResponse, successResponse, errorResponse } from "@/lib/api"
import { requireAdmin } from "@/lib/auth"
import { teamMemberSchema } from "@/lib/validators"
import { notifyIndexNow } from "@/lib/indexnow"

export async function GET() {
  try {
    const team = await getPublicCached("api:team:members", () => prisma.teamMember.findMany({
      orderBy: { displayOrder: "asc" },
    }), [])
    return publicSuccessResponse(team)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    const body = await req.json()
    const validatedData = teamMemberSchema.parse(body)

    const member = await prisma.teamMember.create({
      data: validatedData,
    })
    await invalidatePublicContentCache()

    revalidatePath("/team")
    revalidatePath("/")
    revalidatePath("/admin/team")
    await notifyIndexNow(["/", "/team"])

    return successResponse(member, 201)
  } catch (error: any) {
    return errorResponse(error.message, error.name === "ZodError" ? 400 : 500)
  }
}
