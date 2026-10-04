"use client"

import { useState } from "react"
import Image from "next/image"
import { Search } from "lucide-react"
import { Lightbox } from "./lightbox"
import { cn } from "@/lib/utils"

interface GalleryImage {
  id: string
  url: string
  caption: string | null
  event?: { title: string } | null
}

interface GalleryClientProps {
  images: GalleryImage[]
  eventNames: string[]
}

export function GalleryClient({ images, eventNames }: GalleryClientProps) {
  const [activeFilter, setActiveFilter] = useState("All Photos")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filteredImages = images.filter((img) => {
    if (activeFilter === "All Photos") return true
    return img.event?.title === activeFilter
  })

  return (
    <div className="flex flex-col">
      {/* Filter bar */}
      <div className="bg-surface-2/90 dark:bg-[#0C0C0E]/90 backdrop-blur-md border-b border-primary/10 dark:border-white/10 py-4 sticky top-16 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-2.5 overflow-x-auto no-scrollbar">
          {["All Photos", ...eventNames].map((name) => (
            <button
              key={name}
              onClick={() => setActiveFilter(name)}
              className={cn(
                "font-body text-xs sm:text-sm font-semibold px-5 py-2 rounded-full border transition-all duration-200 whitespace-nowrap shadow-sm",
                activeFilter === name 
                  ? "bg-primary text-white border-primary shadow-md dark:bg-white dark:text-black dark:border-white" 
                  : "bg-white/80 dark:bg-[#18181B] text-primary/70 dark:text-gray-300 border-primary/10 dark:border-white/10 hover:border-primary/30 dark:hover:border-white/30 hover:bg-white dark:hover:bg-[#222226] hover:text-primary dark:hover:text-white"
              )}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {filteredImages.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredImages.map((img, index) => (
              <div 
                key={img.id}
                className="relative group overflow-hidden rounded-3xl break-inside-avoid cursor-pointer bg-white dark:bg-[#121214] border border-primary/10 dark:border-white/10 shadow-[0_8px_30px_rgba(15,36,96,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_45px_rgba(15,36,96,0.12)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.8)] hover:-translate-y-1.5 transition-all duration-300"
                onClick={() => setLightboxIndex(index)}
              >
                <Image 
                  src={img.url} 
                  alt={img.caption || (img.event?.title ? `CIRC event highlight — ${img.event.title}` : "CIRC technology event and community photo")}
                  width={600}
                  height={800}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                
                <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4 rounded-xl">
                  {img.caption && (
                    <p className="font-body text-white text-sm font-medium leading-snug">{img.caption}</p>
                  )}
                  {img.event?.title && (
                    <span className="font-mono text-[10px] tracking-widest uppercase mt-1" style={{ color: "rgba(56,189,248,0.8)" }}>
                      {img.event.title}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface-2 rounded-2xl border border-dashed border-border">
            <p className="font-body text-muted italic">No images found for this category.</p>
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox 
          images={filteredImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((lightboxIndex + 1) % filteredImages.length)}
          onPrev={() => setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length)}
        />
      )}
    </div>
  )
}
