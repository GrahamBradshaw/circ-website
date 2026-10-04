"use client"

import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { cn } from "@/lib/utils"

const Lightbox = dynamic(() => import("./lightbox").then((module) => module.Lightbox), {
  ssr: false,
  loading: () => null,
})

interface GalleryImage {
  id: string
  url: string
  caption: string | null
  event?: { id: string; title: string } | null
}

interface GalleryClientProps {
  images: GalleryImage[]
  events: { id: string; title: string }[]
  initialHasMore: boolean
}

export function GalleryClient({ images: initialImages, events, initialHasMore }: GalleryClientProps) {
  const [images, setImages] = useState(initialImages)
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)
  const requestId = useRef(0)

  async function selectFilter(eventId: string | null) {
    const currentRequest = ++requestId.current
    setActiveFilterId(eventId)
    setLightboxIndex(null)
    if (!eventId) {
      setImages(initialImages)
      setHasMore(initialHasMore)
      setLoading(false)
      return
    }

    setImages([])
    setHasMore(false)
    setLoading(true)
    try {
      const response = await fetch(`/api/gallery?eventId=${encodeURIComponent(eventId)}&limit=24`)
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error("Could not load this gallery")
      if (currentRequest !== requestId.current) return
      setImages(result.data)
      setHasMore(result.pagination.hasMore)
    } catch {
      if (currentRequest !== requestId.current) return
      setImages([])
      setHasMore(false)
    } finally {
      if (currentRequest === requestId.current) setLoading(false)
    }
  }

  async function loadMore() {
    if (loading || !hasMore) return
    const currentRequest = ++requestId.current
    setLoading(true)
    try {
      const query = new URLSearchParams({ skip: String(images.length), limit: "24" })
      if (activeFilterId) query.set("eventId", activeFilterId)
      const response = await fetch(`/api/gallery?${query.toString()}`)
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error("Could not load more photos")
      if (currentRequest !== requestId.current) return
      setImages((current) => [...current, ...result.data])
      setHasMore(result.pagination.hasMore)
    } catch {
      if (currentRequest !== requestId.current) return
      setHasMore(false)
    } finally {
      if (currentRequest === requestId.current) setLoading(false)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="bg-surface-2/90 dark:bg-[#0C0C0E]/90 backdrop-blur-md border-b border-primary/10 dark:border-white/10 py-4 sticky top-16 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-2.5 overflow-x-auto no-scrollbar">
          {[{ id: "all", title: "All Photos" }, ...events].map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => selectFilter(event.id === "all" ? null : event.id)}
              className={cn(
                "font-body text-xs sm:text-sm font-semibold px-5 py-2 rounded-full border transition-all duration-200 whitespace-nowrap shadow-sm",
                (activeFilterId ?? "all") === event.id
                  ? "bg-primary text-white border-primary shadow-md dark:bg-white dark:text-black dark:border-white"
                  : "bg-white/80 dark:bg-[#18181B] text-primary/70 dark:text-gray-300 border-primary/10 dark:border-white/10 hover:border-primary/30 dark:hover:border-white/30 hover:bg-white dark:hover:bg-[#222226] hover:text-primary dark:hover:text-white",
              )}
            >
              {event.title}
            </button>
          ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-12">
        {images.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {images.map((img, index) => (
              <button
                type="button"
                key={img.id}
                className="relative group block w-full overflow-hidden rounded-3xl break-inside-avoid cursor-pointer bg-white dark:bg-[#121214] border border-primary/10 dark:border-white/10 shadow-[0_8px_30px_rgba(15,36,96,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_45px_rgba(15,36,96,0.12)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.8)] hover:-translate-y-1.5 transition-all duration-300"
                onClick={() => setLightboxIndex(index)}
                aria-label={`View ${img.caption || img.event?.title || "CIRC gallery photo"}`}
              >
                <Image
                  src={img.url}
                  alt={img.caption || (img.event?.title ? `CIRC event highlight — ${img.event.title}` : "CIRC technology event and community photo")}
                  width={600}
                  height={800}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  className="w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                <span aria-hidden="true" className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4 text-left">
                  {img.caption && <span className="font-body text-white text-sm font-medium leading-snug">{img.caption}</span>}
                  {img.event?.title && <span className="font-mono text-[10px] tracking-widest uppercase mt-1 text-sky-300">{img.event.title}</span>}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface-2 rounded-2xl border border-dashed border-border">
            <p className="font-body text-muted italic">{loading ? "Loading photos…" : "No images found for this category."}</p>
          </div>
        )}

        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={loading}
              className="rounded-full border border-primary/15 px-6 py-3 font-body text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-60 dark:border-white/20 dark:text-white"
            >
              {loading ? "Loading…" : "Load more photos"}
            </button>
          </div>
        )}
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((index) => index === null ? null : (index + 1) % images.length)}
          onPrev={() => setLightboxIndex((index) => index === null ? null : (index - 1 + images.length) % images.length)}
        />
      )}
    </div>
  )
}
