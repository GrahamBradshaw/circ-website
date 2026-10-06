// This file is part of the CIRC website.
// It belongs to the library layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as typeof globalThis & {
  circPrisma?: PrismaClient
}

// This constant prisma stores shared values used by this file so the logic stays easier to follow.
export const prisma = (globalForPrisma.circPrisma ??= new PrismaClient({
  // Query logging adds work and can expose submitted form data in production logs.
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
}))

export default prisma
