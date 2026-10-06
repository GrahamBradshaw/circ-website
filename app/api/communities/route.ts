// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { prisma } from "@/lib/prisma"
import { getPublicCached } from "@/lib/redis-cache"
import { publicSuccessResponse, errorResponse } from "@/lib/api"
import { FALLBACK_COMMUNITIES } from "@/lib/public-fallbacks"

// This function GET handles the main work in this file and explains what this logic is doing in simple English.
export async function GET() {
  try {
    const communities = await getPublicCached("api:communities:with-leads-count", () => prisma.community.findMany({
      include: {
        lead: true,
        _count: {
          select: { events: true }
        }
      }
    }), FALLBACK_COMMUNITIES.map((community) => ({ ...community, _count: { events: 0 } })))
    return publicSuccessResponse(communities)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}
