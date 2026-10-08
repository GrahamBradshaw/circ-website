import test from "node:test"
import assert from "node:assert/strict"
import { acceptsMarkdown, buildHomepageMarkdown, buildNotFoundMarkdown } from "./agent-readiness.js"

test("acceptsMarkdown recognizes markdown preferences", () => {
  assert.equal(acceptsMarkdown("text/html, application/xhtml+xml, text/markdown;q=0.9"), true)
  assert.equal(acceptsMarkdown("text/html, application/xhtml+xml"), false)
})

test("homepage markdown is non-empty and mentions official CIRC details", () => {
  const markdown = buildHomepageMarkdown()
  assert.ok(markdown.length > 200)
  assert.match(markdown, /# CIRC MNUC/i)
  assert.match(markdown, /https:\/\/www\.circ\.co\.ke\//i)
  assert.match(markdown, /When to use this file/i)
})

test("not-found markdown includes docs and sitemap guidance", () => {
  const markdown = buildNotFoundMarkdown("/missing-page")
  assert.ok(markdown.length > 100)
  assert.match(markdown, /llms\.txt/i)
  assert.match(markdown, /sitemap\.xml/i)
  assert.match(markdown, /homepage: https:\/\/www\.circ\.co\.ke\//i)
})
