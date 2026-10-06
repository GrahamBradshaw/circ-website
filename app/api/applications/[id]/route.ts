// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api"
import { requireAdmin } from "@/lib/auth"

// This function PATCH handles the main work in this file and explains what this logic is doing in simple English.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await requireAdmin()
    if (error) return error
    const body = await req.json()
    const { status } = body

    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return errorResponse("Invalid status", 400)
    }

    const application = await prisma.application.update({
      where: { id },
      data: { status: status as any },
    })

    return successResponse(application)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}
