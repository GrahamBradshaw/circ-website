// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { ImageResponse } from "next/og"
import { prisma } from "@/lib/prisma"
import { plainTextDescription } from "@/lib/seo"

export const alt = "CIRC event"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// This function Image handles the main work in this file and explains what this logic is doing in simple English.
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await prisma.event.findFirst({
    where: { id, published: true },
    select: { title: true, description: true, date: true, venue: true, type: true, coverImage: true },
  })

  const title = event?.title ?? "CIRC Events"
  const description = event ? plainTextDescription(event.description, 150) : "Computing, innovation, research, and technology events at Mama Ngina University College."
  const coverImage = event?.coverImage?.startsWith("http") ? event.coverImage : null

  return new ImageResponse(
    (
      <div
        style={{
          background: "#07142f",
          color: "white",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "64px",
          position: "relative",
          width: "100%",
        }}
      >
        {coverImage && (
          <img
            src={coverImage}
            alt=""
            style={{ height: "100%", left: 0, objectFit: "cover", opacity: 0.28, position: "absolute", top: 0, width: "100%" }}
          />
        )}
        <div style={{ background: "linear-gradient(90deg, rgba(7,20,47,.98) 0%, rgba(7,20,47,.78) 58%, rgba(7,20,47,.3) 100%)", display: "flex", inset: 0, position: "absolute" }} />
        <div style={{ alignItems: "center", display: "flex", fontSize: 28, fontWeight: 700, gap: 14, position: "relative" }}>
          <div style={{ background: "#f97316", borderRadius: 999, height: 18, width: 18 }} />
          CIRC <span style={{ color: "#f97316", fontSize: 20 }}>MAMA NGINA UNIVERSITY COLLEGE</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900, position: "relative" }}>
          <div style={{ color: "#fb923c", fontSize: 22, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>{event?.type ?? "EVENT"}</div>
          <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.08, marginTop: 18 }}>{title}</div>
          <div style={{ color: "#dbe5f5", fontSize: 24, lineHeight: 1.35, marginTop: 22 }}>{description}</div>
        </div>
        <div style={{ color: "#dbe5f5", display: "flex", fontSize: 22, gap: 28, position: "relative" }}>
          <span>{event ? new Date(event.date).toLocaleDateString("en-KE", { dateStyle: "long" }) : "Upcoming event"}</span>
          <span>•</span>
          <span>{event?.venue ?? "CIRC MNUC"}</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
