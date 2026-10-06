// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { Code2, Users2, Rocket, GraduationCap } from "lucide-react"

const FEATURES = [
  {
    icon: Code2,
    title: "Hands-On Projects",
    description: "Build real software and put theory into practice. Every community ships working projects.",
  },
  {
    icon: Users2,
    title: "Peer Mentorship",
    description: "Learn from senior members and community leads who've been where you are.",
  },
  {
    icon: Rocket,
    title: "Career-Ready Skills",
    description: "Hackathons, workshops, and portfolios that stand out to employers.",
  },
  {
    icon: GraduationCap,
    title: "Industry Connections",
    description: "Talks, mentorship, and exposure to how real engineering teams work.",
  },
]

// This function WhyJoin handles the main work in this file and explains what this logic is doing in simple English.
export function WhyJoin() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="font-body text-accent-orange text-xs font-semibold tracking-wide uppercase mb-3">
            Why Join CIRC
          </p>
          <h2 className="section-heading">Built Around Your Growth</h2>
          <p className="section-subheading max-w-xl mx-auto">
            We combine practical projects with community and mentorship to help you grow faster
            than you would on your own.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="text-center sm:text-left">
                <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center mb-4 mx-auto sm:mx-0 text-primary">
                  <Icon size={22} />
                </div>
                <h3 className="font-display text-primary text-base font-bold mb-2">
                  {feature.title}
                </h3>
                <p className="font-body text-muted text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
