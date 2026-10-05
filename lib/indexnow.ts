import { SITE_URL } from "@/lib/seo"

const INDEXNOW_KEY = "ca95958a-2120-4598-afa9-8cf06b85e51c"
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"

/** Notify IndexNow when a public page changes. Failures never block publishing. */
export async function notifyIndexNow(paths: string[]): Promise<void> {
  const urlList = [...new Set(paths.map((path) => new URL(path, SITE_URL).toString()))]
  if (urlList.length === 0) return

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key: INDEXNOW_KEY,
        urlList,
      }),
      signal: AbortSignal.timeout(2500),
      cache: "no-store",
    })

    if (!response.ok) {
      console.warn(`IndexNow notification returned HTTP ${response.status}.`)
    }
  } catch (error) {
    console.warn("IndexNow notification failed; publishing was not affected.", error)
  }
}
