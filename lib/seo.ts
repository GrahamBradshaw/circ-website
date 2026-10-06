// This file is part of the CIRC website.
// It belongs to the library layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
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

// This file is the central SEO source for the website.
// It defines the official site URL and keyword groups that help search engines
// understand the club, the location, and the wider student-tech ecosystem.
// This constant SITE_URL stores shared values used by this file so the logic stays easier to follow.
export const SITE_URL = "https://www.circ.co.ke"

// These keywords describe the nearby universities and colleges around the CIRC area.
// This helps the site rank for local and campus-related searches, not just the brand name.
const INSTITUTION_KEYWORDS = [
 "KCA University",
 "KCA University Ruaraka",
 "KCA University IT",
 "Kenya Utalii College",
 "Kenya Utalii College Ruaraka",
 "Kenya Utalii College Kasarani",
 "USIU Africa",
 "USIU Africa Roysambu",
 "PAC University",
 "PAC University Roysambu",
 "Saint Kizito Institute",
 "Saint Kizito Institute Roysambu",
 "Kenyatta University",
 "Kenyatta University Kahawa",
 "Kenyatta University student clubs",
 "Kenyatta University campus clubs",
 "Kenyatta University near Thika Road",
 "Kise Special Education",
 "Kise Teacher Training College",
 "Kasarani TVC",
 "Compaq College",
 "Compaq College Githurai",
 "Dykaan College",
 "Dykaan College Juja",
 "Zetech University",
 "Zetech University Ruiru",
 "Ruiru TVC",
 "NIBS Technical College",
 "NIBS Technical College Ruiru",
 "JKUAT",
 "Jomo Kenyatta University of Agriculture and Technology",
 "JKUAT Juja",
 "Thika Technical Institute",
 "Mount Kenya University",
 "Mount Kenya University Thika",
 "MKU Thika",
 "Mama Ngina University College",
 "Mama Ngina University",
 "MNU",
 "MNUC",
 "MNUC Kenya",
 "MNUC Kiambu",
 "MNUC near Thika Road",
 "Kahawa universities",
 "Ruiru universities",
 "Juja universities",
 "Roysambu universities",
 "Ruaraka universities",
 "Kasarani universities",
 "Githurai universities",
 "Thika Town universities",
 "Kiambu County universities",
 "Kenya universities near Thika Road",
 "universities along Thika Road",
 "Thika Road universities",
 "student clubs near Thika Road",
 "college clubs Kiambu County",
 "innovation clubs near Thika Road",
 "research clubs near Thika Road",
 "computing clubs near Thika Road",
 "technology clubs near Thika Road",
 "AI clubs near Thika Road",
 "coding clubs near Thika Road",
 "student tech clubs in Kiambu County",
]

// This second keyword group focuses on long-tail, search-intent phrases like
// "innovation clubs in Kenyatta University" and "research clubs near JKUAT".
// These phrases are useful because many students search for clubs by institution name.
const CLUB_QUERY_KEYWORDS = [
 "innovation clubs in KCA University",
 "innovation clubs near KCA University",
 "research clubs in KCA University",
 "research clubs near KCA University",
 "computing clubs in KCA University",
 "computing clubs near KCA University",
 "technology clubs in KCA University",
 "AI clubs in KCA University",
 "coding clubs in KCA University",
 "innovation clubs in Kenya Utalii College",
 "innovation clubs near Kenya Utalii College",
 "research clubs in Kenya Utalii College",
 "computing clubs in Kenya Utalii College",
 "technology clubs in Kenya Utalii College",
 "innovation clubs in USIU Africa",
 "innovation clubs near USIU Africa",
 "research clubs in USIU Africa",
 "computing clubs in USIU Africa",
 "AI clubs in USIU Africa",
 "innovation clubs in PAC University",
 "innovation clubs near PAC University",
 "research clubs in PAC University",
 "computing clubs in PAC University",
 "AI clubs in PAC University",
 "innovation clubs in Saint Kizito Institute",
 "innovation clubs near Saint Kizito Institute",
 "research clubs in Saint Kizito Institute",
 "computing clubs in Saint Kizito Institute",
 "technology clubs in Saint Kizito Institute",
 "innovation clubs in Kenyatta University",
 "innovation clubs near Kenyatta University",
 "research clubs in Kenyatta University",
 "research clubs near Kenyatta University",
 "computing clubs in Kenyatta University",
 "computing clubs near Kenyatta University",
 "AI clubs in Kenyatta University",
 "coding clubs in Kenyatta University",
 "innovation clubs in JKUAT",
 "innovation clubs near JKUAT",
 "research clubs in JKUAT",
 "research clubs near JKUAT",
 "computing clubs in JKUAT",
 "computing clubs near JKUAT",
 "AI clubs in JKUAT",
 "technology clubs in JKUAT",
 "innovation clubs in Zetech University",
 "innovation clubs near Zetech University",
 "research clubs in Zetech University",
 "computing clubs in Zetech University",
 "AI clubs in Zetech University",
 "innovation clubs in Mount Kenya University",
 "innovation clubs near Mount Kenya University",
 "research clubs in Mount Kenya University",
 "computing clubs in Mount Kenya University",
 "technology clubs in Mount Kenya University",
 "innovation clubs in Mama Ngina University College",
 "innovation clubs near Mama Ngina University College",
 "research clubs in Mama Ngina University College",
 "research clubs near Mama Ngina University College",
 "computing clubs in Mama Ngina University College",
 "computing clubs near Mama Ngina University College",
 "technology clubs in Mama Ngina University College",
 "AI clubs in Mama Ngina University College",
 "innovation clubs in Ruaraka",
 "innovation clubs near Ruaraka",
 "research clubs in Ruaraka",
 "research clubs near Ruaraka",
 "computing clubs in Ruaraka",
 "computing clubs near Ruaraka",
 "innovation clubs in Roysambu",
 "innovation clubs near Roysambu",
 "research clubs in Roysambu",
 "computing clubs in Roysambu",
 "innovation clubs in Kasarani",
 "innovation clubs near Kasarani",
 "research clubs in Kasarani",
 "computing clubs in Kasarani",
 "innovation clubs in Kahawa",
 "innovation clubs near Kahawa",
 "research clubs in Kahawa",
 "computing clubs in Kahawa",
 "innovation clubs in Ruiru",
 "innovation clubs near Ruiru",
 "research clubs in Ruiru",
 "computing clubs in Ruiru",
 "innovation clubs in Juja",
 "innovation clubs near Juja",
 "research clubs in Juja",
 "computing clubs in Juja",
 "innovation clubs in Thika",
 "innovation clubs near Thika",
 "research clubs in Thika",
 "computer science clubs in Kenya",
 "computer science clubs near Thika Road",
 "computer science clubs in Kiambu County",
 "computer science clubs in Kenyatta University",
 "computer science clubs in JKUAT",
 "computer science clubs in Zetech University",
 "computer science clubs in KCA University",
 "software development clubs in Kenya",
 "software development clubs near Thika Road",
 "AI clubs in Kiambu County",
 "AI clubs near Kenyatta University",
 "AI clubs near JKUAT",
 "AI clubs near KCA University",
 "research clubs in Kiambu County",
 "research clubs near Kiambu County",
 "innovation clubs in Kiambu County",
 "computing clubs in Kiambu County",
 "innovation club near KCA University",
 "innovation club near JKUAT",
 "innovation club near Zetech University",
 "innovation club near Kenyatta University",
 "research club near KCA University",
 "research club near JKUAT",
 "research club near Kenyatta University",
 "computing club near KCA University",
 "computing club near JKUAT",
 "computing club near Kenyatta University",
 "technology club near Thika Road",
 "technology club near KCA University",
 "technology club near JKUAT",
 "technology club near Zetech University",
 "computer science club Kenya",
 "computer science club Mama Ngina",
 "computer science club MNU",
 "Computer Science",
 "Computer Science Club",
 "Computer Science MNU",
 "computer science club mama ngina",
 "computer science club mnu",
 "MNUC Computer Science Club",
 "innovation club Kenya",
 "research club Kenya",
 "computing club Kenya",
 "tech innovation club Kenya",
 "student innovation club Kenya",
 "student research club Kenya",
 "student computing club Kenya",
 "technology research club Kenya",
 "student technology club Kenya",
 "college computing clubs Kenya",
 "university innovation clubs Kenya",
 "university research clubs Kenya",
 "university computing clubs Kenya",
]

// This is the main keyword list combined from local institutions and club searches.
// We merge them here so every public page gets a strong, consistent SEO signal.
const CORE_KEYWORDS = [
 "Computing Innovation and Research Club",
 "computing innovation and research club",
 "CIRC",
 "CIRC MNUC",
 "CIRC MNU",
 "CIRC Kenya",
 "CIRC club Kenya",
 "CIRC Mama Ngina",
 "Mama Ngina University College",
 "Mama Ngina University",
 "MNU",
 "MNUC",
 "MNUC Kenya",
 "MNUC Kiambu",
 "MNUC near Thika Road",
 "Kenyatta University constituent college",
 "Kenyatta University",
 "Kenyatta University MNUC",
 "Kenyatta University student clubs",
 "Kenyatta University near Thika Road",
 "Kenya universities near Thika Road",
 "universities along Thika Road",
 "Thika Road universities",
 "Kiambu County universities",
 "Thangari Road, Mutomo, Gatundu South, Kiambu County, Kenya",
 "Mutomo Gatundu South tech club",
 "university innovation club Kiambu",
 "MNUC student tech community",
 "MNUC AI club",
 "MNUC ML club",
 "MNUC software development club",
 "MNUC cybersecurity club",
 "MNUC Web3 club",
 "MNUC IoT club",
 "MNUC data science club",
 "MNUC programming club",
 "MNUC technology clubs",
 ...INSTITUTION_KEYWORDS,
 ...CLUB_QUERY_KEYWORDS,
]


// This function builds the metadata object that Next.js uses for a page.
// It adds the title, description, keywords, canonical URL, and social sharing tags.
// This function createPageMetadata handles the main work in this file and explains what this logic is doing in simple English.
export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image = "/android-chrome-512x512.png",
  noIndex = false,
}: PageSeoInput): Metadata {
  // For the homepage, we keep the simple title. For all other pages, we add a short brand suffix.
  const pageTitle = path === "/" ? title : `${title} | CIRC MNUC`

  // Clean the description so it is safe for metadata tags and social cards.
  const pageDescription = plainTextDescription(description) || `Learn about ${title} at Mama Ngina University College.`

  // Merge global keywords with page-specific keywords and remove duplicates.
  const pageKeywords = [...new Set([...CORE_KEYWORDS, ...keywords].map((value) => value.trim()).filter(Boolean))]

  // Build the final URL that search engines should treat as the official page source.
  const canonicalUrl = new URL(path, SITE_URL).toString()

  // Make sure the image path always resolves to a full absolute URL.
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

// This helper removes HTML tags and keeps the description readable for meta tags.
// It also shortens long text so it stays friendly to search engines and social previews.
// This function plainTextDescription handles the main work in this file and explains what this logic is doing in simple English.
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
