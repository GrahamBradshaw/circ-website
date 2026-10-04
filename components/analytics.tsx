"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { GoogleAnalytics } from "@next/third-parties/google"

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

type GoogleTag = ((...args: unknown[]) => void) & { loaded?: boolean }
type ClarityTag = ((...args: unknown[]) => void) & { q?: unknown[][] }

declare global {
  interface Window {
    gtag?: GoogleTag
    clarity?: ClarityTag
  }
}

const PRIVATE_PATHS = [
  "/admin",
  "/admin-entry",
  "/sign-in",
  "/sign-up",
  "/sign-up-success",
  "/access-denied",
]

function isPrivatePath(pathname: string) {
  return PRIVATE_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

function loadClarity() {
  if (!CLARITY_PROJECT_ID) return
  if (!window.clarity) {
    const clarity: ClarityTag = (...args) => {
      clarity.q = clarity.q || []
      clarity.q.push(args)
    }
    window.clarity = clarity
  }
  window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" })
  if (!document.getElementById("circ-microsoft-clarity")) {
    const script = document.createElement("script")
    script.id = "circ-microsoft-clarity"
    script.async = true
    script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`
    document.head.appendChild(script)
  }
}

export function Analytics({ gaMeasurementId }: { gaMeasurementId?: string }) {
  const pathname = usePathname()
  const isPrivate = isPrivatePath(pathname)

  useEffect(() => {
    if (isPrivate) {
      const trackersLoaded = Boolean(
        document.getElementById("_next-ga") ||
        document.getElementById("circ-microsoft-clarity"),
      )
      if (!trackersLoaded) return

      window.gtag?.("consent", "update", { analytics_storage: "denied" })
      window.clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" })
      window.clarity?.("consent", false)
      window.location.reload()
      return
    }

    loadClarity()
  }, [isPrivate])

  return !isPrivate && gaMeasurementId
    ? <GoogleAnalytics gaId={gaMeasurementId} />
    : null
}
