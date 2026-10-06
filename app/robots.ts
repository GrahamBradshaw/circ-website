import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

const siteUrl = SITE_URL

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
        allow: ["/", "/communities/"],
        disallow,
      },
      {
        // Explicit allowance so Yandex (and its images/video bots) crawl public pages.
        userAgent: "Yandex",
        allow: ["/", "/communities/"],
        disallow,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
