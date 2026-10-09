// This file is part of the CIRC website.
// It belongs to the code layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server"
import { acceptsMarkdown, buildHomepageMarkdown, buildNotFoundMarkdown } from "@/lib/agent-readiness.js"

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

const knownPublicPaths = new Set([
  "/",
  "/communities",
  "/communities/",
  "/events",
  "/events/",
  "/team",
  "/team/",
  "/gallery",
  "/gallery/",
  "/history",
  "/join",
  "/contact",
  "/ai-attribution",
  "/privacy",
  "/terms",
  "/cookies",
  "/llms.txt",
  "/ads.txt",
])

function markdownResponse(body: string, status: number) {
  return new NextResponse(body, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "Cache-Control": "no-store",
    },
  })
}

function appendVaryAccept(headers: Headers) {
  const current = headers.get("Vary") ?? ""
  const values = current
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean)

  if (!values.includes("Accept")) {
    values.push("Accept")
    headers.set("Vary", values.join(", "))
  }
}

function isKnownPublicPath(pathname: string) {
  return knownPublicPaths.has(pathname)
    || pathname.startsWith("/communities/")
    || pathname.startsWith("/events/")
    || pathname.startsWith("/team/")
    || pathname.startsWith("/gallery/")
}

function isPublicAsset(pathname: string) {
  return pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/sign-") ||
    pathname.startsWith("/access-denied") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap") ||
    pathname.startsWith("/site.") ||
    /\.[A-Za-z0-9]+$/.test(pathname)
}

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
export default async function proxy(request: NextRequest, event: NextFetchEvent) {
  const acceptHeader = request.headers.get("accept") ?? ""
  const pathname = request.nextUrl.pathname

  if (acceptsMarkdown(acceptHeader)) {
    if (pathname === "/") {
      return markdownResponse(buildHomepageMarkdown(), 200)
    }

    if (!isKnownPublicPath(pathname) && !isPublicAsset(pathname)) {
      return markdownResponse(buildNotFoundMarkdown(pathname), 404)
    }
  }

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
    const response = NextResponse.next()
    appendVaryAccept(response.headers)
    return response
  }

  const response = await clerkProxy(request, event)
  if (response instanceof Response) {
    appendVaryAccept(response.headers)
  }
  return response
}

// This constant config stores shared values used by this file so the logic stays easier to follow.
export const config = {
  matcher: [
    // Skip Next internals and assets. Public paths exit above before Clerk is initialized.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
}
