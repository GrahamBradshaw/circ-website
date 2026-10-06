// This file normalizes the social media links stored in the settings table.
// It prevents broken or unsafe links from being rendered in public pages.
export type SocialSettings = {
  github?: string | null
  twitter?: string | null
  instagram?: string | null
  linkedin?: string | null
} | null

export type SocialProfile = {
  platform: "GitHub" | "X" | "Instagram" | "LinkedIn"
  label: string
  href: string
}

// This helper makes sure a social link is a valid HTTPS URL from an allowed host.
// If the URL is blank, insecure, or not from the expected platform, we ignore it.
function normalizeSocialUrl(value: string | null | undefined, allowedHosts: string[]): string | undefined {
  const trimmed = value?.trim()
  if (!trimmed) return undefined

  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const url = new URL(candidate)
    const host = url.hostname.toLowerCase()
    const isAllowedHost = allowedHosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`))
    if (url.protocol !== "https:" || !isAllowedHost || !url.pathname || url.pathname === "/") return undefined
    return url.toString()
  } catch {
    return undefined
  }
}

// This function turns saved settings into safe public profile links.
// It adds a default Instagram profile if the admin did not add one.
// This function getSocialProfiles handles the main work in this file and explains what this logic is doing in simple English.
export function getSocialProfiles(settings: SocialSettings): SocialProfile[] {
  const configuredInstagram = normalizeSocialUrl(settings?.instagram, ["instagram.com"])

  return [
    { platform: "GitHub", label: "GitHub", href: normalizeSocialUrl(settings?.github, ["github.com"]) },
    { platform: "X", label: "X (Twitter)", href: normalizeSocialUrl(settings?.twitter, ["x.com", "twitter.com"]) },
    {
      platform: "Instagram",
      label: configuredInstagram ? "Instagram" : "Instagram (@circ_mnu)",
      href: configuredInstagram ?? "https://www.instagram.com/circ_mnu/",
    },
    { platform: "LinkedIn", label: "LinkedIn", href: normalizeSocialUrl(settings?.linkedin, ["linkedin.com"]) },
  ].filter((profile): profile is SocialProfile => Boolean(profile.href))
}
