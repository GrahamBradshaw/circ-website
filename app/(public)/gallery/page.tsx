import { prisma } from "@/lib/prisma"
import { getPublicCached } from "@/lib/redis-cache"
import { GalleryClient } from "@/components/public/gallery/gallery-client"
import { PageHero } from "@/components/public/page-hero"
import { createPageMetadata } from "@/lib/seo"

export const revalidate = 300

export const metadata = createPageMetadata({
  title: "CIRC Projects and Event Gallery",
  description: "Photos and highlights from CIRC computing projects, student workshops, research activities, and events at Mama Ngina University College.",
  path: "/gallery",
  keywords: ["student technology projects Kenya", "computing project gallery", "university hackathon photos", "CIRC workshops", "MNUC student projects"],
})

export default async function GalleryPage() {
  let images: any[] = []
  let eventList: any[] = []
  let hasMore = false

  try {
    const [galleryPage, eventsWithGallery] = await Promise.all([
      getPublicCached("gallery:images-with-events:0:24", async () => {
        const rows = await prisma.galleryImage.findMany({
          include: { event: { select: { id: true, title: true } } },
          orderBy: { createdAt: "desc" },
          take: 25,
        })
        return { images: rows.slice(0, 24), hasMore: rows.length > 24 }
      }, { images: [], hasMore: false }),
      getPublicCached("gallery:events-with-images", () => prisma.event.findMany({
        where: { gallery: { some: {} } },
        select: { id: true, title: true },
        orderBy: { date: "desc" },
      }), []),
    ])
    images = galleryPage.images
    hasMore = galleryPage.hasMore
    eventList = eventsWithGallery
  } catch (err) {
    console.error("Gallery DB error:", err)
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface-2 dark:bg-[#09090B] transition-colors">
      <PageHero
        badge="CIRC IN ACTION"
        title="Event & Project Gallery"
        subtitle="Moments from our events, workshops, hackathons, and community activities."
        size="sm"
        image="/hero/hero-bg-5.1af39077.webp"
        imageAlt="CIRC gallery photo"
      />

      {images.length === 0 ? (
        <div className="max-w-2xl mx-auto my-20 px-6">
          <div className="py-24 text-center bg-white dark:bg-[#121214] rounded-3xl border border-dashed border-primary/20 dark:border-white/15 shadow-sm">
            <p className="font-mono text-[10px] tracking-widest uppercase font-bold text-accent-orange mb-3">
              GALLERY ARCHIVE
            </p>
            <h3 className="font-display text-primary dark:text-white text-xl font-bold mb-2">No Photos Published Yet</h3>
            <p className="font-body text-muted dark:text-gray-400 text-sm max-w-sm mx-auto">
              Check back soon for photos from our upcoming workshops and community sessions.
            </p>
          </div>
        </div>
      ) : (
        <GalleryClient
          images={images}
          events={eventList}
          initialHasMore={hasMore}
        />
      )}
    </div>
  )
}
