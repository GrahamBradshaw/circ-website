// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { AtSign, Facebook, Instagram, Linkedin, MessageCircle, Share2 } from "lucide-react"
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
  const units = [
    { key: "days", label: days === 1 ? "Day" : "Days", value: days },
    { key: "hours", label: hours === 1 ? "Hour" : "Hours", value: hours },
    { key: "minutes", label: minutes === 1 ? "Min" : "Mins", value: minutes },
    { key: "seconds", label: seconds === 1 ? "Sec" : "Secs", value: seconds },
  ].filter((unit) => unit.value > 0 || unit.key === "seconds")
  return `STARTS IN ${units.map((unit) => `${String(unit.value).padStart(2, "0")}${unit.label}`).join(" ")}`
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

function getPosterPalette(poster: HTMLImageElement) {
  const sample = document.createElement("canvas")
  sample.width = 32
  sample.height = 32
  const sampleContext = sample.getContext("2d")
  if (!sampleContext) return { color: "7,20,47", text: "#ffffff", accent: "#fed7aa" }

  sampleContext.drawImage(poster, 0, 0, sample.width, sample.height)
  const pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data
  let red = 0
  let green = 0
  let blue = 0
  let count = 0

  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] < 180) continue
    red += pixels[index]
    green += pixels[index + 1]
    blue += pixels[index + 2]
    count += 1
  }

  const averageRed = Math.round(red / Math.max(count, 1))
  const averageGreen = Math.round(green / Math.max(count, 1))
  const averageBlue = Math.round(blue / Math.max(count, 1))
  // Use a darkened complementary colour for the overlay. This keeps the
  // poster visible while ensuring the gradient is deliberately different
  // from the poster's dominant colour.
  const complementaryRed = Math.round((255 - averageRed) * 0.58)
  const complementaryGreen = Math.round((255 - averageGreen) * 0.58)
  const complementaryBlue = Math.round((255 - averageBlue) * 0.58)

  return {
    color: `${complementaryRed},${complementaryGreen},${complementaryBlue}`,
    text: "#ffffff",
    accent: "#ffd166",
  }
}

function loadImage(source: string, crossOrigin = false) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    if (crossOrigin) image.crossOrigin = "anonymous"
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Unable to load ${source}`))
    image.src = source
  })
}

async function createShareCard(title: string, coverImage: string, type: string, venue: string, date: Date | string) {
  const canvas = document.createElement("canvas")
  canvas.width = 500
  canvas.height = 500
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Canvas is unavailable")

  context.fillStyle = "#07142f"
  context.fillRect(0, 0, canvas.width, canvas.height)

  let palette = { color: "7,20,47", text: "#ffffff", accent: "#ffd166" }
  try {
    const poster = await loadImage(coverImage, true)
    palette = getPosterPalette(poster)

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
  gradient.addColorStop(0, `rgba(${palette.color},.96)`)
  gradient.addColorStop(0.58, `rgba(${palette.color},.78)`)
  gradient.addColorStop(1, "rgba(7,12,24,.68)")
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)

  // A separate dark information surface prevents venue/date text from
  // disappearing over bright or detailed poster areas.
  context.fillStyle = "rgba(3,8,18,.72)"
  context.fillRect(16, 330, 468, 145)
  context.shadowColor = "rgba(0,0,0,.85)"
  context.shadowBlur = 5
  context.fillStyle = "#f97316"
  context.fillRect(0, 0, canvas.width, 9)

  context.fillStyle = palette.text
  context.font = "700 16px Arial"
  try {
    const logo = await loadImage("/circ-logo-white.png")
    context.drawImage(logo, 24, 17, 58, 40)
  } catch {
    context.fillText("CIRC", 24, 42)
  }
  context.fillStyle = palette.accent
  context.font = "700 11px Arial"
  context.fillText("MAMA NGINA UNIVERSITY COLLEGE", 100, 42)

  context.fillStyle = palette.accent
  context.font = "700 15px Arial"
  context.fillText(type, 24, 142)
  context.fillStyle = palette.text
  context.font = "800 37px Arial"
  drawText(context, title, 24, 190, 430, 44)
  context.fillStyle = palette.accent
  context.font = "700 15px Arial"
  context.fillText(dateLabel(date), 28, 365)
  context.fillStyle = palette.text
  context.font = "600 14px Arial"
  drawText(context, `${new Date(date).toLocaleDateString("en-KE", { dateStyle: "long" })}  •  ${venue}`, 28, 410, 430, 22)
  context.shadowBlur = 0

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

  function eventMessage() {
    const eventDate = new Date(date).toLocaleString("en-KE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
    return `${title}\n\n${description}\n\n📅 ${eventDate}\n📍 ${venue}\n\n${url}`
  }

  function handlePlatformShare(platform: "whatsapp" | "instagram" | "linkedin" | "x" | "facebook") {
    if (!cardFile) return
    setShareError(null)

    if (platform === "instagram") {
      // Instagram has no browser share endpoint that accepts a generated file.
      // Native sharing is the only web-supported way to attach the card.
      setIsOpen(false)
      void shareWithDevice(cardFile)
      return
    }

    const message = eventMessage()
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}\n\n${description}`)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    }

    window.open(shareUrls[platform], "_blank", "noopener,noreferrer")
  }

  function handleMoreShare() {
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
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => handlePlatformShare("whatsapp")} disabled={!cardFile} title="Share on WhatsApp" aria-label="Share on WhatsApp" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60">
              <MessageCircle size={19} />
            </button>
            <button type="button" onClick={() => handlePlatformShare("instagram")} disabled={!cardFile} title="Share on Instagram" aria-label="Share on Instagram" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pink-600 via-purple-600 to-orange-500 text-white transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60">
              <Instagram size={19} />
            </button>
            <button type="button" onClick={() => handlePlatformShare("linkedin")} disabled={!cardFile} title="Share on LinkedIn" aria-label="Share on LinkedIn" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#0A66C2] text-white transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60">
              <Linkedin size={19} />
            </button>
            <button type="button" onClick={() => handlePlatformShare("x")} disabled={!cardFile} title="Share on X" aria-label="Share on X" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition hover:bg-gray-900 disabled:cursor-wait disabled:opacity-60">
              <AtSign size={19} />
            </button>
            <button type="button" onClick={() => handlePlatformShare("facebook")} disabled={!cardFile} title="Share on Facebook" aria-label="Share on Facebook" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#1877F2] text-white transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60">
              <Facebook size={19} />
            </button>
            <button type="button" onClick={handleMoreShare} disabled={!cardFile} title="Share to more apps" aria-label="Share to more apps" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60">
              <Share2 size={19} />
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
