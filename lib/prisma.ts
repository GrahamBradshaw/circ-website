// This file is part of the CIRC website.
// It belongs to the library layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as typeof globalThis & {
  circPrisma?: PrismaClient
}

function isDatabaseUnavailableError(error: unknown): boolean {
  const value = error instanceof Error ? error.message : String(error)
  return (
    value.includes("Can't reach database server") ||
    value.includes("Connection reset by peer") ||
    value.includes("database server") ||
    value.includes("Client has already been closed") ||
    value.includes("P1001") ||
    value.includes("P1017") ||
    value.includes("P2024")
  )
}

// This constant prisma stores shared values used by this file so the logic stays easier to follow.
export const prisma = (globalForPrisma.circPrisma ??= new PrismaClient({
  // Query logging adds work and can expose submitted form data in production logs.
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
}))

export async function safeDbQuery<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query()
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      throw error
    }

    console.warn("Database unavailable; returning safe fallback data.")
    return fallback
  }
}

export default prisma
