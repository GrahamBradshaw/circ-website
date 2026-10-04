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

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL },
    { url: `${SITE_URL}/communities` },
    { url: `${SITE_URL}/events` },
    { url: `${SITE_URL}/team` },
    { url: `${SITE_URL}/socials` },
    { url: `${SITE_URL}/gallery` },
    { url: `${SITE_URL}/join` },
    { url: `${SITE_URL}/history`},
    { url: `${SITE_URL}/privacy` },
    { url: `${SITE_URL}/terms` },
    { url: `${SITE_URL}/cookies` },
    { url: `${SITE_URL}/ai-attribution` },
  ]

  return [
    ...staticRoutes,
    ...communities.map(({ slug }) => ({
      url: `${SITE_URL}/communities/${encodeURIComponent(slug)}`,
    })),
    ...events.map(({ id }) => ({
      url: `${SITE_URL}/events/${encodeURIComponent(id)}`,
    })),
  ]
}
