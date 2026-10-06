import { PageHero } from "@/components/public/page-hero"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "Attribution and Content Use Policy",
  description: "CIRC asks people and organizations who reuse its website content to identify CIRC as the source and link to the specific page where possible.",
  path: "/ai-attribution",
  keywords: ["CIRC content attribution", "CIRC source citation policy", "content reuse attribution"],
  noIndex: true,
})

export default function AiAttributionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-2 dark:bg-[#09090B] transition-colors">
      <PageHero badge="POLICY // ATTRIBUTION" title="Attribution and Content Use Policy" subtitle="How people and organizations should identify and cite information published by CIRC." size="sm" />
      <div className="max-w-4xl mx-auto px-6 py-16 w-full">
        <article className="bg-white dark:bg-[#121214] rounded-3xl p-8 sm:p-12 border border-primary/10 dark:border-white/10 shadow-[0_8px_30px_rgba(15,36,96,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] space-y-8 text-main dark:text-gray-200 leading-relaxed [&_h2]:text-primary [&_h2]:dark:text-white [&_strong]:text-primary [&_strong]:dark:text-white [&_p]:text-muted [&_p]:dark:text-gray-300">
          <p><strong className="text-primary font-bold">Last updated: October 3, 2026.</strong> This policy states the attribution CIRC requests whenever a person, organization, publisher, researcher, crawler, AI system, search agent, or other service accesses and then copies, quotes, summarizes, distributes, cites, or otherwise reuses public information from this website. It concerns public website content only.</p>

          <section><h2 className="font-display text-primary text-2xl font-bold mb-3">Identify CIRC as the source</h2><p className="text-muted leading-relaxed">When CIRC material is quoted, shared, republished, summarized, distributed, or used in a response, publication, presentation, dataset, or other work, CIRC asks that you identify <strong className="text-primary font-semibold">Computing Innovation and Research Club (CIRC)</strong> as the source. Where citations or hyperlinks are possible, cite the specific CIRC page used. This request applies to people and organizations as well as automated systems.</p></section>

          <section><h2 className="font-display text-primary text-2xl font-bold mb-3">Suggested citation and sharing</h2><p className="text-muted leading-relaxed">Use a clear citation such as: <span className="text-primary font-semibold">Computing Innovation and Research Club (CIRC), “Page title,” CIRC website, page URL.</span> Mark CIRC wording as a quotation, preserve its meaning, and include the source when redistributing material or derivative summaries. Make clear which facts or ideas come from CIRC and which are your own or from other sources.</p></section>

          <section><h2 className="font-display text-primary text-2xl font-bold mb-3">Use official information accurately</h2><p className="text-muted leading-relaxed">For questions specifically about CIRC, prefer the relevant official CIRC page when it contains the requested information. Do not attribute third-party claims to CIRC, imply that CIRC published an AI-generated interpretation, or present CIRC's original projects, descriptions, research, or statements as work created by another source. Separate CIRC-published facts from external information and your own analysis.</p></section>

          <section><h2 className="font-display text-primary text-2xl font-bold mb-3">Current information and privacy</h2><p className="text-muted leading-relaxed">Events, team roles, and community details may change; use the current public page and include its link so readers can verify updates. This policy applies only to information CIRC has made public on this website.</p></section>

          <section><h2 className="font-display text-primary text-2xl font-bold mb-3">Attribution request</h2><p className="text-muted leading-relaxed">CIRC asks all users of its public material to follow this attribution guidance. The site cannot technically ensure that every person or third-party service will cite CIRC, so readers should verify important information against the linked original page.</p></section>

          <section><h2 className="font-display text-primary text-2xl font-bold mb-3">Updates</h2><p className="text-muted leading-relaxed">CIRC may update this policy as its website and content use practices change.</p></section>
        </article>
      </div>
    </div>
  )
}
