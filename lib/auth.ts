import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const ADMIN_ORG_SLUG = process.env.ADMIN_ORG_SLUG ?? "circ-admin-1774191169338462679"

export async function requireAdmin() {
  const { userId, orgSlug } = await auth()

  if (!userId) {
    return {
      error: NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }),
      userId: null,
    }
  }

  if (orgSlug !== ADMIN_ORG_SLUG) {
    return {
      error: NextResponse.json({ success: false, error: "Forbidden: admin access required" }, { status: 403 }),
      userId: null,
    }
  }

  return { error: null, userId }
}

export async function requireAuth() {
  const { userId } = await auth()

  if (!userId) {
    return {
      error: NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }),
      userId: null,
    }
  }

  return { error: null, userId }
}
