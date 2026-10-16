// This file is part of the CIRC website.
// It belongs to the library layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const ADMIN_ORG_SLUG = process.env.ADMIN_ORG_SLUG ?? "circ-admin-1774191169338462679"

// This function isAdmin checks whether the user qualifies as admin via role metadata OR org membership.
async function isAdmin(): Promise<boolean> {
  const { userId, orgSlug } = await auth()
  if (!userId) return false
  if (orgSlug === ADMIN_ORG_SLUG) return true
  const user = await currentUser()
  return user?.publicMetadata?.role === "admin"
}

// This function requireAdmin handles the main work in this file and explains what this logic is doing in simple English.
export async function requireAdmin() {
  const { userId } = await auth()

  if (!userId) {
    return {
      error: NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }),
      userId: null,
    }
  }

  if (!(await isAdmin())) {
    return {
      error: NextResponse.json({ success: false, error: "Forbidden: admin access required" }, { status: 403 }),
      userId: null,
    }
  }

  return { error: null, userId }
}

// This function requireAuth handles the main work in this file and explains what this logic is doing in simple English.
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

