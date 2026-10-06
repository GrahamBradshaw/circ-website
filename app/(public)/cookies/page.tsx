import { PageHero } from "@/components/public/page-hero"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "CIRC Cookie Policy",
  description: "Learn how the CIRC website at Mama Ngina University College uses essential storage and analytics technologies.",
  path: "/cookies",
  keywords: ["CIRC cookie policy", "website analytics cookies", "MNUC website cookies"],
})

export default function CookiesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-2 dark:bg-[#09090B] transition-colors">
      <PageHero badge="LEGAL // COOKIES" title="Cookie Policy" subtitle="How this website uses essential storage and analytics." size="sm" />
      <div className="max-w-4xl mx-auto px-6 py-16 w-full">
        <article className="bg-white dark:bg-[#121214] rounded-3xl p-8 sm:p-12 border border-primary/10 dark:border-white/10 shadow-[0_8px_30px_rgba(15,36,96,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] space-y-8 text-main dark:text-gray-200 leading-relaxed [&_h2]:text-primary [&_h2]:dark:text-white [&_strong]:text-primary [&_strong]:dark:text-white [&_p]:text-muted [&_p]:dark:text-gray-300">
          <p><strong className="text-primary font-bold">Last updated: October 1, 2026.</strong> Cookies and similar technologies are small pieces of information stored on or accessed from your device. Essential storage supports sign-in, security, and core website functions. Google Analytics, Microsoft Clarity, and Yandex.Metrika are enabled by default on public pages to measure site usage and improve usability.</p>
          <section><h2 className="font-display text-primary text-2xl font-bold mb-3">Analytics technologies</h2><p className="text-muted leading-relaxed">Google Analytics measures page visits and website usage, Microsoft Clarity helps us understand interactions and usability, and Yandex.Metrika measures visits, clicks, and page behavior. They run by default on public pages; the website does not provide a cookie preference or opt-out control. These services may use cookies, identifiers, scripts, and similar technologies and may receive technical information such as pages visited, browser and device details, and interactions. Google, Microsoft, and Yandex process data under their own privacy terms. We do not enable advertising features in this configuration. You can use your browser settings to block or clear cookies, though this may affect site functionality.</p></section>
          <section><h2 className="font-display text-primary text-2xl font-bold mb-3">Your choices</h2><p className="text-muted leading-relaxed">The site has no in-page control to turn analytics off. You may contact CIRC at <a className="text-accent-orange font-semibold hover:underline" href="mailto:circ@mnu.ac.ke">circ@mnu.ac.ke</a> to exercise rights that apply to you, including the right to object where provided by law. Browser settings can block or clear cookies, though that does not disable all forms of analytics and may affect site functionality.</p></section>
          <section><h2 className="font-display text-primary text-2xl font-bold mb-3">Contact</h2><p className="text-muted leading-relaxed">For questions about cookies or your privacy choices, contact <a className="text-accent-orange font-semibold hover:underline" href="mailto:circ@mnu.ac.ke">circ@mnu.ac.ke</a>. See our <a className="text-accent-orange font-semibold hover:underline" href="/privacy">Privacy Policy</a> for more information.</p></section>
        </article>
      </div>
    </div>
  )
}
