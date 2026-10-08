import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"

const rootLayout = fs.readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8")
const publicLayout = fs.readFileSync(new URL("../app/(public)/layout.tsx", import.meta.url), "utf8")

test("root and public layouts opt into dynamic SSR", () => {
  assert.match(rootLayout, /export const dynamic = "force-dynamic"/)
  assert.match(publicLayout, /export const dynamic = "force-dynamic"/)
})
