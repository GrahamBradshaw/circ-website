// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import type { Metadata } from "next"
import Script from "next/script"
import { GoogleTagManager } from "@next/third-parties/google"
import { Suspense } from "react"
import { Analytics } from "@/components/analytics"
import { SITE_URL } from "@/lib/seo"
import { Inter } from "next/font/google"
import "./globals.css"
import "@fontsource/jetbrains-mono/400.css"
import "@fontsource/jetbrains-mono/700.css"

const inter = Inter({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  display: "swap",
  variable: "--font-inter",
})

// This is the global metadata for the whole application.
// Next.js reads this object to set the default title, description, social cards, and SEO tags.
// This constant metadata stores shared values used by this file so the logic stays easier to follow.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CIRC MNUC | Computing Innovation and Research Club",
    template: "%s",
  },
  description: "Computing Innovation and Research Club (CIRC MNUC) at Mama Ngina University College in Mutomo, Gatundu South, Kiambu County, Kenya — technology, innovation, research, AI, coding, and computing club for students near Thika Road, Kenyatta University, JKUAT, and Kiambu County.",
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "CIRC MNUC",
    title: "CIRC MNUC | Computing Innovation and Research Club",
    description: "Computing Innovation and Research Club (CIRC MNUC) at Mama Ngina University College in Mutomo, Gatundu South, Kiambu County, Kenya — student innovation, coding, AI, and research community near Thika Road, Kenyatta University, JKUAT, and Kiambu County.",
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/android-chrome-512x512.png`, alt: "CIRC at Mama Ngina University College" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Computing Innovation and Research Club (CIRC MNUC) at Mama Ngina University College",
    description: "CIRC MNUC is a student technology, innovation, and research club at Mama Ngina University College in Kiambu County, Kenya — near Thika Road and connected to Kenyatta University.",
    images: [`${SITE_URL}/android-chrome-512x512.png`],
  },
  alternates: { canonical: SITE_URL },
  applicationName: "CIRC",
  verification: {
    google: "HswHGpatHGOjDuhlScdSyICzJfWexOEs4CG-AlaR-G4",
    yandex: "d4a2b549f1955318",
    other: {
      "msvalidate.01": "EDDB31F2840D76A7E103286A266CB6E3",
    },
  },
  keywords: [
    "Computing Innovation and Research Club",
    "CIRC Kenya",
    "CIRC MNUC",
    "Mama Ngina University College",
    "Mama Ngina University",
    "MNU",
    "MNUC technology club",
    "Kenyatta University constituent college",
    "Kenyatta University",
    "JKUAT",
    "Jomo Kenyatta University of Agriculture and Technology",
    "KCA University",
    "KCA University Ruaraka",
    "Kenya Utalii College",
    "Kenya Utalii College Ruaraka",
    "USIU Africa",
    "PAC University",
    "Zetech University",
    "Mount Kenya University",
    "universities along Thika Road",
    "Kiambu County universities",
    "Roysambu universities",
    "Ruaraka universities",
    "Kasarani universities",
    "Juja universities",
    "Ruiru universities",
    "Thika Road student clubs",
    "innovation clubs in Kenya",
    "innovation clubs near Thika Road",
    "research clubs in Kenya",
    "research clubs near Thika Road",
    "computing clubs in Kenya",
    "computing clubs near Thika Road",
    "AI clubs in Kenyatta University",
    "AI clubs in JKUAT",
    "AI clubs in KCA University",
    "computer science clubs in Kiambu County",
    "computer science clubs near Thika Road",
    "innovation clubs in KCA University",
    "innovation clubs in JKUAT",
    "innovation clubs in Zetech University",
    "innovation clubs in Kenyatta University",
    "research clubs in Kenyatta University",
    "research clubs in JKUAT",
    "research clubs in KCA University",
    "computing clubs in Kenyatta University",
    "computing clubs in JKUAT",
    "computing clubs in KCA University",
    "School of Pure and Applied Sciences SPAS",
    "computer science and information technology Kenya",
    "software development, AI, data science, cybersecurity",
    "innovation clubs in Ruaraka",
    "innovation clubs in Roysambu",
    "innovation clubs in Kasarani",
    "innovation clubs in Kahawa",
    "innovation clubs in Ruiru",
    "innovation clubs in Juja",
    "innovation clubs in Thika",
    "research clubs in Ruaraka",
    "research clubs in Roysambu",
    "research clubs in Kasarani",
    "research clubs in Kiambu County",
    "computing clubs in Ruaraka",
    "computing clubs in Roysambu",
    "computing clubs in Kasarani",
    "technology clubs near Thika Road",
    "coding clubs near Thika Road",
    "AI clubs near Thika Road",
  ],
  authors: [{ name: "Computing Innovation & Research Club" }],
  creator: "Computing Innovation & Research Club",
  publisher: "Computing Innovation & Research Club",
  referrer: "origin-when-cross-origin",
  robots: {
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
}

// This is the root layout for the application.
// Every page is wrapped by this layout, so the global site metadata and scripts are shared everywhere.
// This function RootLayout handles the main work in this file and explains what this logic is doing in simple English.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={inter.variable}>
      <body className="font-body antialiased">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WPQDDGS8"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <GoogleTagManager gtmId="GTM-WPQDDGS8" />
        <Script
          id="circ-theme-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mql = window.matchMedia('(prefers-color-scheme: dark)');
                  function applyTheme(isDark) {
                    if (isDark) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  }
                  applyTheme(mql.matches);
                  if (mql.addEventListener) {
                    mql.addEventListener('change', function(e) { applyTheme(e.matches); });
                  } else if (mql.addListener) {
                    mql.addListener(function(e) { applyTheme(e.matches); });
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: "Computing Innovation and Research Club (CIRC MNUC)",
              alternateName: ["CIRC MNUC", "CIRC MNU", "CIRC", "Computer Science Club", "Computer Science MNU", "MNUC Computer Science Club"],
              url: SITE_URL,
              logo: `${SITE_URL}/logo.webp`,
              email: "circ@mnu.ac.ke",
              address: {
                "@type": "PostalAddress",
                "streetAddress": "Along Thangari Road, Mutomo",
                "addressLocality": "Gatundu South",
                "addressRegion": "Kiambu County",
                "postalCode": "01030",
                "addressCountry": "KE",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: -1.037054,
                longitude: 36.923318,
              },
              hasMap: "https://share.google/5NucqVDcuhPzsBwSS",
              description: "A student computing, technology, innovation, and research club at Mama Ngina University College, along Thangari Road in Mutomo, Gatundu South, Kiambu County, Kenya.",
              parentOrganization: {
                "@type": "CollegeOrUniversity",
                name: "Mama Ngina University College",
                alternateName: ["Mama Ngina University", "MNU", "MNUC"],
                url: "https://mnu.ac.ke/",
              },
              knowsAbout: ["Computing", "Software development", "Artificial intelligence", "Data science", "Cybersecurity", "Internet of Things", "Technology research"],
            }).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <Suspense fallback={null}>
          <Analytics gaMeasurementId="G-G0PTNXCJ2Y" />
        </Suspense>
      </body>
    </html>
  )
}
