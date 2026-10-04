'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useOrganizationList, useAuth } from "@clerk/nextjs"

export default function AdminEntryPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const { userMemberships, setActive } = useOrganizationList({ userMemberships: true })
  const router = useRouter()
  const adminOrgSlug = "circ-admin-1774191169338462679"

  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      router.push("/sign-in")
      return
    }

    const adminMembership = userMemberships.data?.find(
      (m) => m.organization.slug === adminOrgSlug
    )

    if (!adminMembership) {
      router.push("/?error=unauthorized")
      return
    }

    // Set the active organization so orgSlug is available to later requests.
    if (setActive) {
        setActive({ organization: adminMembership.organization.id }).then(() => {
          router.push("/admin")
        })
    }
  }, [isLoaded, isSignedIn, userMemberships.data, setActive, router])

  return (
    <div className="min-h-screen bg-surface-2 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-body text-muted text-sm">Verifying access...</p>
      </div>
    </div>
  )
}
