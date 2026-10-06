// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { PageHero } from "@/components/public/page-hero"
import { createPageMetadata } from "@/lib/seo"

// This constant metadata stores shared values used by this file so the logic stays easier to follow.
export const metadata = createPageMetadata({
  title: "CIRC Website Terms and Conditions",
  description: "Terms for using the Computing Innovation & Research Club website and participating in club activities at Mama Ngina University College.",
  path: "/terms",
  keywords: ["CIRC website terms", "club participation terms", "MNUC website terms"],
  noIndex: true,
})

// This function TermsPage handles the main work in this file and explains what this logic is doing in simple English.
export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-2 dark:bg-[#09090B] transition-colors">
      <PageHero badge="LEGAL // TERMS" title="Terms and Conditions" subtitle="The basic terms for using the CIRC website and participating in club activities." size="sm" />
      <div className="max-w-4xl mx-auto px-6 py-16 w-full">
        <article className="bg-white dark:bg-[#121214] rounded-3xl p-8 sm:p-12 border border-primary/10 dark:border-white/10 shadow-[0_8px_30px_rgba(15,36,96,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] space-y-8 text-main dark:text-gray-200 leading-relaxed [&_h2]:text-primary [&_h2]:dark:text-white [&_strong]:text-primary [&_strong]:dark:text-white [&_p]:text-muted [&_p]:dark:text-gray-300">
          <p><strong className="text-primary font-bold">Last updated: October 1, 2026.</strong> These terms cover use of the Computing Innovation &amp; Research Club (CIRC) website at Mama Ngina University College. By using the site, you agree to follow these terms and applicable law. If you do not agree, do not use the site.</p>
          <section><h2 className="font-display text-primary text-2xl font-bold mb-3">Acceptable use</h2><p className="text-muted leading-relaxed">Do not misuse the website, attempt unauthorized access, interfere with its operation, submit false or unlawful material, infringe another person’s rights, or use club resources to harm others. Membership and event participation may be subject to additional university or club rules.</p></section>
          <section><h2 className="font-display text-primary text-2xl font-bold mb-3">Applications and accounts</h2><p className="text-muted leading-relaxed">Provide accurate information when applying or using an account, and protect your sign-in credentials. An application does not guarantee membership, event admission, or access to club resources. CIRC may review, approve, or decline applications under its membership process and applicable university rules.</p></section>
          <section><h2 className="font-display text-primary text-2xl font-bold mb-3">Content and availability</h2><p className="text-muted leading-relaxed">Website information is provided for general club and community purposes. Schedules, availability, and program details may change. We make reasonable efforts to keep information current but do not guarantee that every item is complete or error-free. Content you submit must be yours or used with permission. You allow CIRC to use submitted content as needed to review your application or provide the service you requested; this does not transfer your ownership of it.</p></section>
          <section><h2 className="font-display text-primary text-2xl font-bold mb-3">Third-party services and privacy</h2><p className="text-muted leading-relaxed">The website relies on third-party providers for some services. Their services may have separate terms and privacy practices. Our collection and use of personal information are described in the <a className="text-accent-orange font-semibold hover:underline" href="/privacy">Privacy Policy</a> and <a className="text-accent-orange font-semibold hover:underline" href="/cookies">Cookie Policy</a>.</p></section>
          <section><h2 className="font-display text-primary text-2xl font-bold mb-3">Changes and contact</h2><p className="text-muted leading-relaxed">We may change the website or these terms as club operations evolve. The updated date above identifies the latest revision. Questions can be sent to <a className="text-accent-orange font-semibold hover:underline" href="mailto:circ@mnu.ac.ke">circ@mnu.ac.ke</a>.</p></section>
        </article>
      </div>
    </div>
  )
}
