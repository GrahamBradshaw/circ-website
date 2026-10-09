// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

const siteUrl = SITE_URL

// This function robots handles the main work in this file and explains what this logic is doing in simple English.
export default function robots(): MetadataRoute.Robots {
  const publicAllowlist = [
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
  ]

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
        allow: publicAllowlist,
        disallow,
      },
      {
        // Explicit allowance so AI and search crawlers can index public CIRC pages.
        userAgent: "GPTBot",
        allow: publicAllowlist,
        disallow,
      },
      {
        userAgent: "ClaudeBot",
        allow: publicAllowlist,
        disallow,
      },
      {
        userAgent: "Google-Extended",
        allow: publicAllowlist,
        disallow,
      },
      {
        userAgent: "PerplexityBot",
        allow: publicAllowlist,
        disallow,
      },
      {
        // Explicit allowance so Yandex (and its images/video bots) crawl public pages.
        userAgent: "Yandex",
        allow: publicAllowlist,
        disallow,
      },
      {
        // Explicit allowance so Bing (Bingbot, MSNBot, AdIdxBot) crawls public pages.
        userAgent: "Bingbot",
        allow: publicAllowlist,
        disallow,
      },
      {
        userAgent: "msnbot",
        allow: publicAllowlist,
        disallow,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
