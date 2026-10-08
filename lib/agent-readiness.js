export function acceptsMarkdown(acceptHeader = "") {
  return acceptHeader
    .split(",")
    .map((part) => part.trim().split(";")[0].toLowerCase())
    .some((value) => value === "text/markdown" || value === "application/markdown")
}

export function buildHomepageMarkdown() {
  return `# CIRC MNUC

Computing Innovation and Research Club (CIRC MNUC) is a student-led computing, innovation, and research community at Mama Ngina University College in Mutomo, Gatundu South, Kiambu County, Kenya. CIRC helps students learn software development, AI, data science, cybersecurity, Web3, and the Internet of Things through workshops, projects, technical communities, and events.

## What we do
- Learn programming, software engineering, and practical computing skills.
- Explore AI, machine learning, data science, and research methods.
- Build projects in teams and present work to the wider community.
- Connect students with technical communities, events, and collaboration opportunities.

## When to use this file
Use this file when an agent needs a concise public summary of CIRC’s purpose, communities, location, membership path, and official contact routes. It is especially useful for questions about joining the club, learning about student communities, or identifying the official CIRC pages for events, history, and contact information.

Official website: https://www.circ.co.ke/
Join: https://www.circ.co.ke/join
Contact: https://www.circ.co.ke/contact
History: https://www.circ.co.ke/history
Docs: https://www.circ.co.ke/llms.txt
Sitemap: https://www.circ.co.ke/sitemap.xml
`
}

export function buildNotFoundMarkdown(pathname) {
  return `# Page not found

The page \`${pathname}\` does not exist on the CIRC website. Please check the official CIRC docs and sitemap for the correct public pages.

- Docs: https://www.circ.co.ke/llms.txt
- Sitemap: https://www.circ.co.ke/sitemap.xml
- Homepage: https://www.circ.co.ke/
`
}
