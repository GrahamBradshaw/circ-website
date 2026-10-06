// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface ImageItem {
  id: string
  url: string
  caption: string | null
  event?: { title: string } | null
}

interface LightboxProps {
  images: ImageItem[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

// This function Lightbox handles the main work in this file and explains what this logic is doing in simple English.
export function Lightbox({ images, currentIndex, onClose, onNext, onPrev }: LightboxProps) {
  const currentImage = images[currentIndex]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") onNext()
      if (e.key === "ArrowLeft") onPrev()
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose, onNext, onPrev])

  if (!currentImage) return null

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      {/* Overlay click area */}
      <div className="absolute inset-0 z-0" onClick={onClose} />

      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer z-50"
      >
        <X size={24} />
      </button>

      {/* Nav arrows */}
      <button 
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer z-50"
      >
        <ChevronLeft size={32} />
      </button>

      <div className="relative max-w-5xl w-full z-10 flex flex-col items-center">
        <div className="relative w-full h-[70vh]">
          <Image 
            src={currentImage.url} 
            alt={currentImage.caption || "Gallery Image"}
            fill
            sizes="100vw"
            className="object-contain rounded-lg"
            priority
          />
        </div>
        
        {currentImage.caption && (
          <p className="font-body text-white/80 text-sm text-center mt-3 max-w-2xl mx-auto">
            {currentImage.caption}
          </p>
        )}
        {currentImage.event?.title && (
          <p className="font-mono text-center mt-1" style={{ color: "rgba(56,189,248,0.6)", fontSize: "10px", letterSpacing: "0.1em" }}>
            {currentImage.event.title}
          </p>
        )}

        <div className="mt-4 text-white/30 text-xs font-mono">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      <button 
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer z-50"
      >
        <ChevronRight size={32} />
      </button>
    </div>
  )
}
