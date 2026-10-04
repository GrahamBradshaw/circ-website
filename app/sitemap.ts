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
      select: { id: true },
    }).catch((error) => {
      console.error("Sitemap event query failed; publishing static routes only.", error)
      return []
    }),
  ])
  const communitySlugs = [...new Set([
    ...FALLBACK_COMMUNITIES.map(({ slug }) => slug),
    ...communities.map(({ slug }) => slug),
  ])]

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL },
    { url: `${SITE_URL}/communities` },
    { url: `${SITE_URL}/events` },
    { url: `${SITE_URL}/team` },
    { url: `${SITE_URL}/gallery` },
    { url: `${SITE_URL}/join` },
    {
      url: `${SITE_URL}/history`,
      lastModified: new Date("2026-10-04T00:00:00.000Z"),
    },
    { url: `${SITE_URL}/privacy` },
    { url: `${SITE_URL}/terms` },
    { url: `${SITE_URL}/cookies` },
    { url: `${SITE_URL}/ai-attribution` },
  ]

  return [
    ...staticRoutes,
    ...communitySlugs.map((slug) => ({
      url: `${SITE_URL}/communities/${encodeURIComponent(slug)}`,
    })),
    ...events.map(({ id }) => ({
      url: `${SITE_URL}/events/${encodeURIComponent(id)}`,
    })),
  ]
}
