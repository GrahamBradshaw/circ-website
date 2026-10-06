// This file is part of the CIRC website.
// It belongs to the library layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { NextResponse } from "next/server"

// This function successResponse handles the main work in this file and explains what this logic is doing in simple English.
export function successResponse(data: any, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

// This function errorResponse handles the main work in this file and explains what this logic is doing in simple English.
export function errorResponse(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status })
}

// This function publicSuccessResponse handles the main work in this file and explains what this logic is doing in simple English.
export function publicSuccessResponse(data: unknown, status = 200) {
  return NextResponse.json(
    { success: true, data },
    {
      status,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  )
}
