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

  const staticRoutes = [
    "/",
    "/communities",
    "/events",
    "/gallery",
    "/join",
    "/team",
    "/privacy",
    "/terms",
    "/cookies",
    "/ai-attribution",
  ]

  return [
    ...staticRoutes.map((route) => ({
      // Keep the homepage URL byte-for-byte aligned with the emitted canonical.
      url: route === "/" ? SITE_URL : new URL(route, `${SITE_URL}/`).toString(),
    })),
    ...communities.map(({ slug }) => ({
      url: new URL(`/communities/${encodeURIComponent(slug)}`, `${SITE_URL}/`).toString(),
    })),
    ...events.map(({ id }) => ({
      url: new URL(`/events/${encodeURIComponent(id)}`, `${SITE_URL}/`).toString(),
    })),
  ]
}
