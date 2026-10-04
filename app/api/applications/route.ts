import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const { error } = await requireAdmin()
    if (error) return error

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1)
    const pageSize = 25
    const statuses = ["PENDING", "APPROVED", "REJECTED"] as const
    if (status && !statuses.includes(status as (typeof statuses)[number])) {
      return NextResponse.json({ success: false, error: "Invalid application status" }, { status: 400 })
    }
    const where = status ? { status: status as (typeof statuses)[number] } : undefined

    const [applications, total, groupedStatuses] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: { submittedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.application.count({ where }),
      prisma.application.groupBy({ by: ["status"], _count: { _all: true } }),
    ])
    const statusCounts = Object.fromEntries(
      groupedStatuses.map(({ status: applicationStatus, _count }) => [applicationStatus, _count._all]),
    )

    return NextResponse.json({
      success: true,
      data: applications,
      pagination: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
      statusCounts,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  // No auth — public endpoint
  try {
    const body = await req.json()
    const application = await prisma.application.create({ data: body })
    return NextResponse.json({ success: true, data: application }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "Failed to submit application" }, { status: 500 })
  }
}
