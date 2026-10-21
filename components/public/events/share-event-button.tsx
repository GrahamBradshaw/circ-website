// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Instagram, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShareEventButtonProps {
  title: string
  url: string
  description: string
  coverImage: string
  date: Date | string
  type: string
  venue: string
}

function dateLabel(date: Date | string) {
  const start = new Date(date).getTime()
  const distance = start - Date.now()
  const end = start + 4 * 60 * 60 * 1000

  if (distance <= 0 && Date.now() < end) return "ONGOING NOW"
  if (distance <= 0) return "EVENT ENDED"

  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)
  return `STARTS IN ${String(days).padStart(2, "0")}D ${String(hours).padStart(2, "0")}H ${String(minutes).padStart(2, "0")}M ${String(seconds).padStart(2, "0")}S`
}

function drawText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ")
  let line = ""
  let offset = 0

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (context.measureText(candidate).width > maxWidth && line) {
      context.fillText(line, x, y + offset)
      line = word
      offset += lineHeight
    } else {
      line = candidate
    }
  }

  if (line) context.fillText(line, x, y + offset)
}

async function createShareCard(title: string, coverImage: string, type: string, venue: string, date: Date | string) {
  const canvas = document.createElement("canvas")
  canvas.width = 500
  canvas.height = 500
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Canvas is unavailable")

  context.fillStyle = "#07142f"
  context.fillRect(0, 0, canvas.width, canvas.height)

  try {
    const poster = new Image()
    poster.crossOrigin = "anonymous"
    await new Promise<void>((resolve, reject) => {
      poster.onload = () => resolve()
      poster.onerror = () => reject(new Error("Poster could not be loaded"))
      poster.src = coverImage
    })

    const scale = Math.max(canvas.width / poster.width, canvas.height / poster.height)
    const width = poster.width * scale
    const height = poster.height * scale
    context.globalAlpha = 0.32
    context.drawImage(poster, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height)
    context.globalAlpha = 1
  } catch {
    // The branded card remains shareable if a remote poster blocks canvas access.
  }

  const gradient = context.createLinearGradient(0, 0, canvas.width, 0)
  gradient.addColorStop(0, "rgba(7,20,47,.98)")
  gradient.addColorStop(1, "rgba(7,20,47,.58)")
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = "#f97316"
  context.fillRect(0, 0, canvas.width, 9)

  context.fillStyle = "#ffffff"
  context.font = "700 16px Arial"
  context.fillText("●  CIRC", 24, 42)
  context.fillStyle = "#fb923c"
  context.font = "700 10px Arial"
  context.fillText("MAMA NGINA UNIVERSITY COLLEGE", 100, 42)

  context.fillStyle = "#fb923c"
  context.font = "700 13px Arial"
  context.fillText(type, 24, 142)
  context.fillStyle = "#ffffff"
  context.font = "800 36px Arial"
  drawText(context, title, 24, 190, 430, 44)
  context.fillStyle = "#fbbf24"
  context.font = "700 13px Arial"
  context.fillText(dateLabel(date), 24, 360)
  context.fillStyle = "#dbe5f5"
  context.font = "400 12px Arial"
  drawText(context, `${new Date(date).toLocaleDateString("en-KE", { dateStyle: "long" })}  •  ${venue}`, 24, 405, 440, 18)

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9))
  if (!blob) throw new Error("Card image could not be created")
  return new File([blob], `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.jpg`, { type: "image/jpeg" })
}

// This function ShareEventButton handles the main work in this file and explains what this logic is doing in simple English.
export function ShareEventButton({ title, url, description, coverImage, date, type, venue }: ShareEventButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [shareError, setShareError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [cardFile, setCardFile] = useState<File | null>(null)
  const [cardUrl, setCardUrl] = useState<string | null>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted || !isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, mounted])

  useEffect(() => {
    if (!isOpen) return
    let active = true
    void createShareCard(title, coverImage, type, venue, date).then((file) => {
      if (!active) return
      setCardFile(file)
      setCardUrl(URL.createObjectURL(file))
    }).catch(() => {
      if (active) setShareError("The event card could not be generated. Please try again.")
    })

    return () => {
      active = false
      setCardFile(null)
      setCardUrl((current) => {
        if (current) URL.revokeObjectURL(current)
        return null
      })
    }
  }, [coverImage, date, isOpen, title, type, venue])

  async function shareWithDevice(file?: File) {
    const imageFile = file ?? cardFile ?? await createShareCard(title, coverImage, type, venue, date)

    if (!window.isSecureContext) {
      setShareError("Open this page over HTTPS to share images to installed apps.")
      setIsOpen(true)
      return
    }

    if (!navigator.share) {
      setShareError("This browser does not provide native image sharing.")
      setIsOpen(true)
      return
    }

    try {
      const eventDate = new Date(date).toLocaleString("en-KE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
      const shareMessage = `${title}\n\n${description}\n\n📅 ${eventDate}\n📍 ${venue}\n\n${url}`

      // Share the very same File used by the preview together with a useful
      // message. Messaging apps can display the text and keep the URL tappable.
      await navigator.share({
        files: [imageFile],
        title: `${title} | CIRC MNUC`,
        text: shareMessage,
      })
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      setShareError("Chrome could not pass this image to the native share sheet.")
      setIsOpen(true)
    }
  }

  function handleShareClick() {
    // The card is generated before these buttons become enabled. Calling the
    // native API directly from this tap preserves Android's transient user
    // activation requirement.
    if (!cardFile) return
    setShareError(null)
    setIsOpen(false)
    void shareWithDevice(cardFile)
  }

  return (
    <>
    <button
      type="button"
        onClick={() => setIsOpen(true)}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/15 px-6 py-3.5 font-body text-sm font-semibold text-primary transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:bg-surface-2 dark:border-white/15 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/10",
      )}
    >
      <Share2 size={16} />
      Share event card
    </button>

    {mounted && isOpen && createPortal(
      <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/75 p-4 sm:items-center" role="dialog" aria-modal="true" aria-label="Share event card">
        <div className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#18181B]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent-orange">Share event card</p>
              <h3 className="mt-1 font-display text-xl font-bold text-primary dark:text-white">{title}</h3>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className="text-2xl leading-none text-muted hover:text-primary dark:hover:text-white" aria-label="Close share options">×</button>
          </div>
          <div className="mb-5 overflow-hidden rounded-2xl border border-primary/10 bg-surface-2 dark:border-white/10 dark:bg-[#09090B]">
            {cardUrl ? <img src={cardUrl} alt={`Share preview for ${title}`} className="aspect-square w-full object-cover" /> : <div className="aspect-square w-full animate-pulse bg-[#07142f]" />}
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button type="button" onClick={handleShareClick} disabled={!cardFile} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-orange-500 px-4 py-3.5 font-body text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60">
              <Instagram size={17} /> Instagram / Stories
            </button>
            <button type="button" onClick={handleShareClick} disabled={!cardFile} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 font-body text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60">
              <Share2 size={17} /> More apps
            </button>
          </div>
          {shareError && <p className="mt-3 text-center font-body text-xs leading-relaxed text-red-500">{shareError}</p>}
          <p className="mt-5 text-center font-body text-xs leading-relaxed text-muted dark:text-gray-400">The event card preview is generated from the event page and opens the full event when clicked.</p>
        </div>
      </div>,
      document.body,
    )}
    </>
  )
}
