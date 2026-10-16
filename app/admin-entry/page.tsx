// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useOrganizationList, useAuth, useUser } from "@clerk/nextjs"

// This function AdminEntryPage handles the main work in this file and explains what this logic is doing in simple English.
export default function AdminEntryPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user, isLoaded: isUserLoaded } = useUser()
  const { userMemberships, setActive } = useOrganizationList({ userMemberships: true })
  const router = useRouter()
  const adminOrgSlug = process.env.NEXT_PUBLIC_ADMIN_ORG_SLUG ?? "circ-admin-1774191169338462679"

  useEffect(() => {
    if (!isLoaded || !isUserLoaded) return
    if (userMemberships.isLoading) return

    if (!isSignedIn) {
      router.push("/sign-in")
      return
    }

    // Path 1: user has the admin role in their metadata — go straight in.
    if (user?.publicMetadata?.role === "admin") {
      router.push("/admin")
      return
    }

    // Path 2: user is an org member — activate the org first so orgSlug is set.
    const adminMembership = userMemberships.data?.find(
      (m) => m.organization.slug === adminOrgSlug
    )

    if (adminMembership && setActive) {
      setActive({ organization: adminMembership.organization.id }).then(() => {
        router.push("/admin")
      })
      return
    }

    // Neither condition met — deny access.
    router.push("/?error=unauthorized")
  }, [isLoaded, isUserLoaded, isSignedIn, user, userMemberships.isLoading, userMemberships.data, setActive, router, adminOrgSlug])

  return (
    <div className="min-h-screen bg-surface-2 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-body text-muted text-sm">Verifying access...</p>
      </div>
    </div>
  )
}
