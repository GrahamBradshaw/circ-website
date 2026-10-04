import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as typeof globalThis & {
  circPrisma?: PrismaClient
}

export const prisma = (globalForPrisma.circPrisma ??= new PrismaClient({
  // Query logging adds work and can expose submitted form data in production logs.
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
}))

export default prisma
