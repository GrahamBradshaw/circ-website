// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"
import { SITE_URL } from "@/lib/seo"
import { FALLBACK_COMMUNITIES } from "@/lib/public-fallbacks"

// This constant revalidate stores shared values used by this file so the logic stays easier to follow.
export const revalidate = 3600

// This file builds the sitemap for the public website.
// Search engines use this file to discover the most important pages and keep them indexed.
// This function sitemap handles the main work in this file and explains what this logic is doing in simple English.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const [communities, events] = await Promise.all([
    prisma.community.findMany({ select: { slug: true } }).catch((error) => {
      console.error("Sitemap community query failed; using known public communities.", error)
      return FALLBACK_COMMUNITIES.map(({ slug }) => ({ slug }))
    }),
    prisma.event.findMany({
      where: { published: true },
      select: { id: true, createdAt: true },
    }).catch((error) => {
      console.error("Sitemap event query failed; publishing static routes only.", error)
      return []
    }),
  ])

  // These are the main public pages that should always be easy to find.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/communities`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/events`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/team`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/gallery`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/join`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/history`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // Legal/policy pages are noindex — intentionally excluded from the sitemap
    // so Bing/Yandex consolidate ranking signals on real content.
  ]

  return [
    ...staticRoutes,
    ...communities.map(({ slug }) => ({
      url: `${SITE_URL}/communities/${encodeURIComponent(slug)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...events.map(({ id, createdAt }) => ({
      url: `${SITE_URL}/events/${encodeURIComponent(id)}`,
      lastModified: createdAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ]
}
