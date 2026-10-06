import { prisma } from "@/lib/prisma"
import { getPublicCached } from "@/lib/redis-cache"
import { PageHero } from "@/components/public/page-hero"
import { LocationMapSection } from "@/components/public/location-map"
import { ContactCards, ContactSocials } from "@/components/public/contact/contact-sections"
import { createPageMetadata, SITE_URL } from "@/lib/seo"
import { getSocialProfiles } from "@/lib/social-links"

export const metadata = createPageMetadata({
  title: "Contact CIRC at Mama Ngina University College",
  description: "Contact the Computing Innovation and Research Club (CIRC) at Mama Ngina University College.",
  path: "/contact",
  keywords: ["contact CIRC", "CIRC email", "CIRC Mama Ngina contact", "CIRC social media"],
})

export const revalidate = 300

export default async function ContactPage() {
  const settings = await getPublicCached("contact:settings", () => prisma.settings.findUnique({
    where: { id: "singleton" },
    select: { github: true, twitter: true, instagram: true, linkedin: true, contactEmail: true },
  }), null)
  const socialProfiles = getSocialProfiles(settings)
  const contactEmail = settings?.contactEmail || "circ@mnu.ac.ke"
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE_URL}/contact#webpage`,
    url: `${SITE_URL}/contact`,
    name: "Contact the Computing Innovation and Research Club (CIRC MNUC)",
    about: { "@id": `${SITE_URL}/#organization` },
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface-2 dark:bg-[#09090B] transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      <PageHero
        badge="GET IN TOUCH"
        title={<>Contact <span className="text-accent-orange font-extrabold italic">CIRC</span></>}
        subtitle="Questions about membership, partnerships, or collaborations? Reach the club directly."
        size="md"
        image="/hero/hero-bg-5.1af39077.webp"
        imageAlt="CIRC members collaborating at Mama Ngina University College"
      />
      <ContactCards contactEmail={contactEmail} />
      <ContactSocials socialProfiles={socialProfiles} />
      <LocationMapSection tone="tinted" />
    </div>
  )
}
