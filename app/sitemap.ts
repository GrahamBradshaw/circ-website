import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"
import { SITE_URL } from "@/lib/seo"
import { FALLBACK_COMMUNITIES } from "@/lib/public-fallbacks"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const now = new Date().toISOString()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/communities`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/events`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/team`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/gallery`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/join`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/ai-attribution`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ]

  return [
    ...staticRoutes,
    ...communities.map(({ slug }) => ({
      url: `${SITE_URL}/communities/${encodeURIComponent(slug)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...events.map(({ id, createdAt }) => ({
      url: `${SITE_URL}/events/${encodeURIComponent(id)}`,
      lastModified: createdAt ? new Date(createdAt).toISOString() : now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ]
}
