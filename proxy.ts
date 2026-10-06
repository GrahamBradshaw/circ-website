// This file is part of the CIRC website.
// It belongs to the code layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server"

const clerkProxy = clerkMiddleware()

const clerkOnlyPrefixes = [
  "/admin",
  "/admin-entry",
  "/api",
  "/trpc",
  "/sign-in",
  "/sign-up",
  "/access-denied",
  "/__clerk",
]

function needsClerk(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  if (pathname.startsWith("/api/")) {
    const isPublicRead = request.method === "GET" && [
      /^\/api\/communities(?:\/[^/]+)?$/,
      /^\/api\/events(?:\/[^/]+)?$/,
      /^\/api\/team(?:\/[^/]+)?$/,
      /^\/api\/gallery$/,
      /^\/api\/settings$/,
    ].some((route) => route.test(pathname))
      && !(pathname === "/api/events" && searchParams.get("all") === "true")

    // Membership applications are intentionally submitted by signed-out users.
    if (isPublicRead || (pathname === "/api/applications" && request.method === "POST")) {
      return false
    }
  }

  return clerkOnlyPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

// This function proxy handles the main work in this file and explains what this logic is doing in simple English.
export default function proxy(request: NextRequest, event: NextFetchEvent) {
  // Use one canonical public host so crawlers do not split indexing signals.
  const proto = request.headers.get("x-forwarded-proto")
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()
  const host = (forwardedHost ?? request.headers.get("host") ?? "").split(":")[0].toLowerCase()
  if (process.env.NODE_ENV === "production" && (proto === "http" || host === "circ.co.ke")) {
    const httpsUrl = request.nextUrl.clone()
    httpsUrl.protocol = "https:"
    httpsUrl.host = "www.circ.co.ke"
    return NextResponse.redirect(httpsUrl, 301)
  }

  // Public content is server-rendered and does not need Clerk session setup.
  if (!needsClerk(request)) {
    return NextResponse.next()
  }

  return clerkProxy(request, event)
}

// This constant config stores shared values used by this file so the logic stays easier to follow.
export const config = {
  matcher: [
    // Skip Next internals and assets. Public paths exit above before Clerk is initialized.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
}
