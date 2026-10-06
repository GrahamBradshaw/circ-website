import type { Metadata } from "next"

type PageSeoInput = {
  title: string
  description: string
  path: string
  keywords?: string[]
  image?: string
  /** Set true for legal/policy pages so they never outrank real content. */
  noIndex?: boolean
}

export const SITE_URL = "https://www.circ.co.ke"

const CORE_KEYWORDS = [
  "Computing Innovation & Research Club",
  "CIRC Kenya",
  "Mama Ngina University College",
  "Mama Ngina University",
  "MNU",
  "Computer Science Club",
  "MNUC Computer Science Club",
  "Thangari Road, Mutomo, Gatundu South, Kiambu County, Kenya",
  "Kenyatta University",
]

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image = "/android-chrome-512x512.png",
  noIndex = false,
}: PageSeoInput): Metadata {
  const pageTitle = path === "/" ? title : `${title} | CIRC MNUC`
  const pageDescription = plainTextDescription(description) || `Learn about ${title} at Mama Ngina University College.`
  const pageKeywords = [...new Set([...CORE_KEYWORDS, ...keywords])]
  const canonicalUrl = new URL(path, SITE_URL).toString()
  const absoluteImage = new URL(image, SITE_URL).toString()

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      locale: "en_KE",
      siteName: "Computing Innovation and Research Club (CIRC MNUC)",
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      images: [{ url: absoluteImage, alt: `${title}: Computing Innovation & Research Club` }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [absoluteImage],
    },
  }
}

export function plainTextDescription(value: string, maxLength = 160): string {
  const plainText = value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim()

  if (plainText.length <= maxLength) return plainText
  return `${plainText.slice(0, maxLength - 1).trimEnd()}…`
}
