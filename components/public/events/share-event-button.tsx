// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
"use client"

import { useState } from "react"
import { Facebook, MessageCircle, Share2, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShareEventButtonProps {
  title: string
  url: string
  imageUrl: string
}

// This function ShareEventButton handles the main work in this file and explains what this logic is doing in simple English.
export function ShareEventButton({ title, url, imageUrl }: ShareEventButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  async function shareEvent() {
    const shareData = {
      title: `${title} | CIRC MNUC`,
      text: `Check out this CIRC event: ${title}`,
      url,
    }

    try {
      if (navigator.share) {
        try {
          const response = await fetch(imageUrl)
          if (!response.ok) throw new Error("Unable to load event card")
          const imageBlob = await response.blob()
          const imageFile = new File([imageBlob], `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`, { type: "image/png" })
          const fileShare = { ...shareData, files: [imageFile] }

          if (navigator.canShare?.({ files: [imageFile] })) {
            await navigator.share(fileShare)
            return
          }
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return
        }

        setIsOpen(true)
        return
      }

      setIsOpen(true)
    } catch (error) {
      // Closing the native share sheet is not an error and should not show a toast.
      if (error instanceof DOMException && error.name === "AbortError") return
      setIsOpen(true)
    }
  }

  return (
    <>
    <button
      type="button"
      onClick={shareEvent}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/15 px-6 py-3.5 font-body text-sm font-semibold text-primary transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:bg-surface-2 dark:border-white/15 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/10",
      )}
    >
      <Share2 size={16} />
      Share event card
    </button>

    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-4 sm:items-center" role="dialog" aria-modal="true" aria-label="Share event card">
        <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#18181B]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent-orange">Share event card</p>
              <h3 className="mt-1 font-display text-xl font-bold text-primary dark:text-white">{title}</h3>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className="text-2xl leading-none text-muted hover:text-primary dark:hover:text-white" aria-label="Close share options">×</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <a href={`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="flex flex-col items-center gap-2 rounded-2xl bg-green-500/10 px-3 py-4 text-xs font-semibold text-green-700 hover:bg-green-500/20 dark:text-green-300">
              <MessageCircle size={22} /> WhatsApp
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="flex flex-col items-center gap-2 rounded-2xl bg-blue-500/10 px-3 py-4 text-xs font-semibold text-blue-700 hover:bg-blue-500/20 dark:text-blue-300">
              <Facebook size={22} /> Facebook
            </a>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="flex flex-col items-center gap-2 rounded-2xl bg-black/10 px-3 py-4 text-xs font-semibold text-black hover:bg-black/15 dark:text-white">
              <X size={22} /> X
            </a>
          </div>
          <p className="mt-5 text-center font-body text-xs leading-relaxed text-muted dark:text-gray-400">The event card preview is generated from the event page and opens the full event when clicked.</p>
        </div>
      </div>
    )}
    </>
  )
}
