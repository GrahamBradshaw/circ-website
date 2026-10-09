// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
"use client"

import Script from "next/script"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { GoogleAnalytics } from "@next/third-parties/google"

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID
const YANDEX_METRICA_ID = 113439470

type GoogleTag = ((...args: unknown[]) => void) & { loaded?: boolean }
type ClarityTag = ((...args: unknown[]) => void) & { q?: unknown[][] }
type YandexMetricaTag = ((...args: unknown[]) => void) & { a?: unknown[]; l?: number }

declare global {
  interface Window {
    gtag?: GoogleTag
    clarity?: ClarityTag
    ym?: YandexMetricaTag
  }
}

const PRIVATE_PATHS = [
  "/admin",
  "/admin-entry",
  "/sign-in",
  "/sign-up",
  "/sign-up-success",
  "/access-denied",
]

function isPrivatePath(pathname: string) {
  return PRIVATE_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

function loadClarity() {
  if (!CLARITY_PROJECT_ID) return
  if (!window.clarity) {
    const clarity: ClarityTag = (...args) => {
      clarity.q = clarity.q || []
      clarity.q.push(args)
    }
    window.clarity = clarity
  }
  window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" })
  if (!document.getElementById("circ-microsoft-clarity")) {
    const script = document.createElement("script")
    script.id = "circ-microsoft-clarity"
    script.async = true
    script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`
    document.head.appendChild(script)
  }
}

// This function Analytics handles the main work in this file and explains what this logic is doing in simple English.
export function Analytics({ gaMeasurementId }: { gaMeasurementId?: string }) {
  const pathname = usePathname()
  const isPrivate = isPrivatePath(pathname)

  useEffect(() => {
    if (isPrivate) {
      const trackersLoaded = Boolean(
        document.getElementById("_next-ga") ||
          document.getElementById("circ-microsoft-clarity") ||
          document.getElementById("circ-yandex-metrika"),
      )
      if (!trackersLoaded) return

      window.gtag?.("consent", "update", { analytics_storage: "denied" })
      window.clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" })
      window.clarity?.("consent", false)
      window.location.reload()
      return
    }

    loadClarity()
  }, [isPrivate])

  // Track client-side route changes in Yandex.Metrika (App Router is an SPA).
  useEffect(() => {
    if (isPrivate) return
    if (typeof window === "undefined" || typeof window.ym !== "function") return
    try {
      window.ym(YANDEX_METRICA_ID, "hit", window.location.href)
    } catch {
      // Ignore analytics errors so they never break navigation.
    }
  }, [pathname, isPrivate])

  if (isPrivate) return null

  return (
    <>
      {gaMeasurementId ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
      {/* Yandex.Metrika counter */}
      <Script
        id="circ-yandex-metrika"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.defer=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRICA_ID}','ym');ym(${YANDEX_METRICA_ID},'init',{ssr:true,webvisor:true,trackHash:true,clickmap:true,ecommerce:'dataLayer',referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});`,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://mc.yandex.ru/watch/${YANDEX_METRICA_ID}`}
          style={{ position: "absolute", left: "-9999px" }}
          alt=""
        />
      </noscript>
      {/* /Yandex.Metrika counter */}
    </>
  )
}
