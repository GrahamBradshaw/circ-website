import { PageHero } from "@/components/public/page-hero"
import { createPageMetadata, SITE_URL } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "CIRC MNUC History: From Computer Science Club to CIRC",
  description: "Read the history of the Computing Innovation and Research Club at Mama Ngina University College, from its 2022 Computer Science Club beginnings to the CIRC rebrand in 2026.",
  path: "/history",
  keywords: ["CIRC MNUC history", "Computer Science Club MNUC", "CIRC founding", "CIRC student leadership", "Mama Ngina University College club history"],
})

const milestones = [
  {
    date: "20 January 2022",
    title: "The club begins",
    paragraphs: [
      "Graham Bradshaw founded the Computer Science Club and became its first Chairperson. Catherine Achieng helped lead the early club.",
      "Dion Martin became patron after transferring from Kenyatta University. He served from the club's founding until 15 March 2026, when he was recalled to Kenyatta University.",
      "The club gave students a place to learn computing, share ideas and build skills together.",
    ],
  },
  {
    date: "September 2023",
    title: "More students take on leadership",
    paragraphs: [
      "James Maina joined as Secretary and Solomon Kaniaru joined the Organising Secretary's team, helping coordinate club activities.",
    ],
  },
  {
    date: "2023",
    title: "Members represent their school",
    paragraphs: [
      "Club Treasurer Alamalik Kweyu was elected SPAS Congressperson for the School of Pure and Applied Sciences.",
    ],
  },
  {
    date: "Since 2023",
    title: "Three consecutive Best Club Awards",
    paragraphs: [
      "The Computer Science Club became the first and only club to win the award three years in a row, recognising its contribution to campus life.",
    ],
  },
  {
    date: "2024",
    title: "New roles and learning opportunities",
    paragraphs: [
      "In October, Mark Chore became SPAS Congressperson. Shalom Malika, an SGC Vice President in 2024, was also associated with the club.",
      "Sir Harun Kamau began serving as assistant patron and continues in the role.",
      "Students explored Avalanche and Web3 through new technology connections. That interest led to AVAX Academy, a learning programme focused on Avalanche.",
    ],
  },
  {
    date: "2025 to 2026",
    title: "A new SGC term",
    paragraphs: [
      "After the October 2025 elections, Mark Chore served as SGC Secretary General. Arnold Chepkonga was the outgoing SPAS Congressperson and was not elected into the SGC.",
      "Their terms ended on the same day. Both are awaiting the next elections in October 2026.",
    ],
  },
  {
    date: "March 2026",
    title: "The club becomes CIRC",
    paragraphs: [
      "The Computer Science Club adopted the name Computing Innovation and Research Club. Dr Ruth became patron after Dion Martin's recall, with Sir Harun Kamau continuing as assistant patron.",
      "CIRC introduced focused communities where students learn, collaborate and build projects across technology and research.",
    ],
  },
  {
    date: "2026",
    title: "Solomon Kaniaru earns national recognition",
    paragraphs: [
      "Solomon Kaniaru was nominated for Best Skills Development Initiative of the Year. He was the only student and the only developer in the category, and finished as second runner-up.",
      "The recognition reflects CIRC's ambition to share its work with a global audience.",
    ],
    link: "https://aes.tuqiohub.africa/nominee?slug=solomon-kaniaru&event=aes-awards-2026",
  },
]

const articleData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The History, Growth and Legacy of CIRC MNUC",
  description: "The history of the Computer Science Club at Mama Ngina University College and its transition to the Computing Innovation and Research Club (CIRC MNUC) in March 2026.",
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
        title="The History of CIRC MNUC"
        subtitle="How a student computer science club grew into a community for computing, innovation and research."
        size="md"
      />

      <article className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-12 max-w-3xl rounded-[2rem] border border-primary/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#121214] sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-orange">Our story</p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-primary dark:text-white sm:text-3xl">A student club with room to grow</h2>
          <p className="mt-3 font-body leading-7 text-muted dark:text-gray-300">
            Founded in 2022, the Computer Science Club grew through student leadership, campus recognition and shared technology projects. In 2026, it became CIRC MNUC.
          </p>
          <div className="mt-6 grid max-w-xl grid-cols-3 gap-2.5 text-center sm:gap-4">
            {[
              ["2022", "Founded"],
              ["3", "Club awards"],
              ["2026", "Rebranded to CIRC"],
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
