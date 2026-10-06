// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { uploadToImageKit } from "@/lib/imagekit"

// This function POST handles the main work in this file and explains what this logic is doing in simple English.
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file || typeof file === "string") {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")

    const url = await uploadToImageKit(buffer, cleanName, "/circ/gallery")
    return NextResponse.json({ success: true, url })
  } catch (err: any) {
    console.error("Upload error:", err)
    return NextResponse.json({ success: false, error: err.message ?? "Upload failed" }, { status: 500 })
  }
}
