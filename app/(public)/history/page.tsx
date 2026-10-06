import { PageHero } from "@/components/public/page-hero"
import { createPageMetadata, SITE_URL } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "CIRC History and Growth | MNUC Student Tech Community",
  description: "History of the Computing Innovation and Research Club (CIRC MNUC) at Mama Ngina University College, Kenya. Public record of CIRC's growth, leadership, student innovation, and rebrand near Thika Road and Kenyatta University.",
  path: "/history",
  keywords: ["CIRC history", "CIRC MNUC history", "MNUC student club history", "Computer Science Club MNUC", "computing club Kenya", "CIRC founding", "CIRC student leadership", "Mama Ngina University College club history", "Alamalik Kweyu", "CIRC rebrand 2026"],
})

const milestones = [
  {
    date: "Pre-2022 to present",
    title: "Early founding details remain under review",
    paragraphs: [
      "The current public record confirms that CIRC is the student computing and research community at Mama Ngina University College, but the exact original founding date, founders, and first chairperson are not yet fully verified from public sources.",
      "The website documents only publicly verifiable milestones and keeps the earlier institutional story clearly marked as a work in progress rather than a final historical claim.",
    ],
  },
  {
    date: "2022",
    title: "Student computing activity becomes visible on campus",
    paragraphs: [
      "The club's public timeline shows growing student interest in computing, technology learning, collaboration, and leadership at MNUC. The earliest public record can be documented reliably from the current club story, but exact founding details are still being verified.",
    ],
  },
  {
    date: "September 2023",
    title: "Leadership expands and programme activity grows",
    paragraphs: [
      "Public records from the club's later leadership period show stronger organisational structure, with students taking on secretary and organising roles to coordinate events, projects, and campus engagement.",
    ],
  },
  {
    date: "2023",
    title: "Alamalik Kweyu becomes the first SPAS Congressperson",
    paragraphs: [
      "Club Treasurer Alamalik Kweyu became the first student from Mama Ngina University College, also known as Mama Ngina University or MNU, to serve as SPAS Congressperson for the School of Pure and Applied Sciences.",
    ],
  },
  {
    date: "Since 2023",
    title: "Three consecutive Best Club Awards",
    paragraphs: [
      "Public club records describe consecutive Best Club Awards in the years following the club's earlier student leadership work, reinforcing its growing campus impact.",
    ],
  },
  {
    date: "2024",
    title: "New leadership roles and broader technology learning",
    paragraphs: [
      "Public records also point to continued growth in student leadership, community activities, and wider technology learning opportunities, including exposure to Web3, blockchain, and related emerging areas.",
    ],
  },
  {
    date: "2025 to 2026",
    title: "Student governance and broader community leadership",
    paragraphs: [
      "Further public milestone records show continued student leadership representation and wider involvement in university governance, while the organization continued to evolve toward a more multidisciplinary technical club identity.",
    ],
  },
  {
    date: "March 2026",
    title: "The club adopts CIRC as its public identity",
    paragraphs: [
      "The public record shows the Computer Science Club adopting the name Computing Innovation and Research Club (CIRC). The rebrand reflects a broader focus on computing, innovation, research, and student communities while preserving the club's earlier technical and leadership legacy.",
    ],
  },
  {
    date: "2026",
    title: "Solomon Kaniaru gains national recognition",
    paragraphs: [
      "Solomon Kaniaru was nominated for Best Skills Development Initiative of the Year. He was the only student and only developer in the category and finished as second runner-up.",
      "This recognition reflects CIRC's commitment to sharing student work and expanding its reach beyond campus.",
    ],
    link: "https://aes.tuqiohub.africa/nominee?slug=solomon-kaniaru&event=aes-awards-2026",
  },
]

const articleData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The History, Growth and Legacy of CIRC MNUC",
  description: "The history of the Computer Science Club at Mama Ngina University College and its transition to the Computing Innovation and Research Club (CIRC MNUC) in March 2026.",
  image: `${SITE_URL}/hero/hero-bg-2.90cbe47a.webp`,
  datePublished: "2022-01-20",
  dateModified: "2026-03-01",
  mainEntityOfPage: `${SITE_URL}/history`,
  about: { "@id": `${SITE_URL}/#organization` },
  author: { "@id": `${SITE_URL}/#organization` },
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-KE",
}

export default function HistoryPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-2 dark:bg-[#09090B] transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData).replace(/</g, "\\u003c") }}
      />
      <PageHero
        badge="OUR STORY 2022 TO TODAY"
        title="Computer Science Club to CIRC MNUC"
        subtitle="The history of the student computing club that grew into CIRC, a community for computing, innovation and research."
        size="md"
        image="/hero/hero-bg-2.90cbe47a.webp"
        imageAlt="History of the Computing Innovation and Research Club at Mama Ngina University College"
      />

      <article className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-12 max-w-3xl rounded-[2rem] border border-primary/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#121214] sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-orange">Our story</p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-primary dark:text-white sm:text-3xl">A public history, documented carefully</h2>
          <p className="mt-3 font-body leading-7 text-muted dark:text-gray-300">
            The current public record confirms CIRC is the student computing, research and innovation community at Mama Ngina University College. The club's broader history is documented here, but early founding details remain intentionally marked as unverified until public evidence is stronger.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted dark:text-gray-400">
            Mama Ngina University College is also commonly referred to as Mama Ngina University or MNU.
          </p>
          <div className="mt-6 grid max-w-xl grid-cols-3 gap-2.5 text-center sm:gap-4">
            {[
              ["2022+", "Public timeline begins"],
              ["3", "Club awards"],
              ["2026", "CIRC rebrand"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-surface-2 px-2 py-3 dark:bg-white/5 sm:px-4 sm:py-4">
                <p className="font-display text-xl font-bold text-primary dark:text-white sm:text-2xl">{value}</p>
                <p className="mt-1 text-[11px] leading-4 text-muted dark:text-gray-400 sm:text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-orange">The timeline</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-primary dark:text-white sm:text-3xl">Milestones</h2>
          </div>
          <p className="hidden text-sm text-muted dark:text-gray-400 sm:block">2022 to 2026</p>
        </div>

        <ol className="relative space-y-4 border-s border-primary/15 ps-5 dark:border-white/15 sm:space-y-5 sm:ps-8">
          {milestones.map((milestone) => (
            <li key={milestone.title} className="relative">
              <span aria-hidden="true" className="absolute -start-[1.72rem] top-6 h-3 w-3 rounded-full border-2 border-white bg-accent-orange ring-4 ring-accent-orange/15 dark:border-[#09090B] sm:-start-[2.3rem]" />
              <section className="grid gap-3 rounded-3xl border border-primary/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#121214] sm:p-7 md:grid-cols-[9rem_1fr] md:gap-6">
                <p className="pt-1 text-xs font-semibold uppercase tracking-[0.12em] text-accent-orange">{milestone.date}</p>
                <div>
                  <h3 className="font-display text-lg font-bold tracking-tight text-primary dark:text-white sm:text-xl">{milestone.title}</h3>
                  <div className="mt-3 space-y-2 font-body leading-7 text-muted dark:text-gray-300">
                    {milestone.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                  {"link" in milestone && milestone.link && (
                    <a
                      href={milestone.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex text-sm font-semibold text-accent-orange underline decoration-accent-orange/40 underline-offset-4 transition hover:decoration-accent-orange"
                    >
                      View Solomon's nominee profile
                    </a>
                  )}
                </div>
              </section>
            </li>
          ))}
        </ol>
      </article>
    </div>
  )
}
