// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

const siteUrl = SITE_URL

// This function robots handles the main work in this file and explains what this logic is doing in simple English.
export default function robots(): MetadataRoute.Robots {
  const disallow = [
    "/api/",
    "/admin",
    "/admin-entry",
    "/sign-in",
    "/sign-up",
    "/sign-up-success",
    "/access-denied",
    "/trpc/",
  ]

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Yandex",
        allow: "/",
        disallow,
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
