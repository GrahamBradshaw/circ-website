// This file is part of the CIRC website.
// It belongs to the API layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { ImageResponse } from "next/og"
import { prisma } from "@/lib/prisma"
import { plainTextDescription } from "@/lib/seo"

export const runtime = "nodejs"

function countdownLabel(date: Date) {
  const now = Date.now()
  const distance = date.getTime() - now
  const eventEnd = date.getTime() + 4 * 60 * 60 * 1000

  if (distance <= 0 && now < eventEnd) return "ONGOING NOW"
  if (distance <= 0) return "EVENT ENDED"

  const days = Math.floor(distance / 86400000)
  const hours = Math.floor((distance % 86400000) / 3600000)
  const minutes = Math.floor((distance % 3600000) / 60000)
  const seconds = Math.floor((distance % 60000) / 1000)
  const units = [
    { key: "days", label: days === 1 ? "Day" : "Days", value: days },
    { key: "hours", label: hours === 1 ? "Hour" : "Hours", value: hours },
    { key: "minutes", label: minutes === 1 ? "Min" : "Mins", value: minutes },
    { key: "seconds", label: seconds === 1 ? "Sec" : "Secs", value: seconds },
  ].filter((unit) => unit.value > 0 || unit.key === "seconds")
  return `STARTS IN  ${units.map((unit) => `${String(unit.value).padStart(2, "0")}${unit.label}`).join("  ")}`
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await prisma.event.findFirst({
    where: { id, published: true },
    select: { title: true, description: true, date: true, venue: true, type: true, coverImage: true },
  })

  if (!event) return new Response("Event not found", { status: 404 })

  let posterData: string | null = null
  try {
    const poster = await fetch(event.coverImage)
    if (poster.ok) {
      const type = poster.headers.get("content-type") || "image/jpeg"
      posterData = `data:${type};base64,${Buffer.from(await poster.arrayBuffer()).toString("base64")}`
    }
  } catch {
    // Keep the branded card usable when the poster host is temporarily unavailable.
  }

  return new ImageResponse(
    (
      <div style={{ background: "#07142f", color: "white", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", padding: 56, position: "relative", width: "100%" }}>
        {posterData && <img src={posterData} alt="" style={{ height: "100%", left: 0, objectFit: "cover", opacity: 0.3, position: "absolute", top: 0, width: "100%" }} />}
        <div style={{ background: "linear-gradient(90deg, rgba(7,20,47,.98), rgba(7,20,47,.65))", display: "flex", height: "100%", left: 0, position: "absolute", top: 0, width: "100%" }} />
        <div style={{ alignItems: "center", display: "flex", fontSize: 26, fontWeight: 700, gap: 12, position: "relative" }}>
          <div style={{ background: "#f97316", borderRadius: 999, height: 16, width: 16 }} />
          CIRC <span style={{ color: "#fb923c", fontSize: 18 }}>MAMA NGINA UNIVERSITY COLLEGE</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000, position: "relative" }}>
          <div style={{ color: "#fb923c", fontSize: 20, fontWeight: 700, letterSpacing: 4 }}>{event.type}</div>
          <div style={{ fontSize: 54, fontWeight: 800, lineHeight: 1.08, marginTop: 14 }}>{event.title}</div>
          <div style={{ color: "#dbe5f5", fontSize: 22, lineHeight: 1.3, marginTop: 16 }}>{plainTextDescription(event.description, 140)}</div>
          <div style={{ color: "#fbbf24", fontSize: 22, fontWeight: 700, letterSpacing: 2, marginTop: 24 }}>{countdownLabel(event.date)}</div>
        </div>
        <div style={{ color: "#dbe5f5", display: "flex", fontSize: 20, gap: 24, position: "relative" }}>
          <span>{new Date(event.date).toLocaleDateString("en-KE", { dateStyle: "long" })}</span>
          <span>•</span>
          <span>{event.venue}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
