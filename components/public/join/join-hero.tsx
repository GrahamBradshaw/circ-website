// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { GraduationCap, Zap, Users, Briefcase, Code2, Heart } from "lucide-react"

const benefits = [
  { icon: GraduationCap, label: "Workshops & Skillbuilding" },
  { icon: Zap, label: "Hackathons & Sprints" },
  { icon: Users, label: "Peer Mentorship" },
  { icon: Briefcase, label: "Industry Connections" },
  { icon: Code2, label: "Real-world Projects" },
  { icon: Heart, label: "Vibrant Community" },
]

// This function JoinHero handles the main work in this file and explains what this logic is doing in simple English.
export function JoinHero() {
  return (
    <section className="bg-surface-2 py-20">
      <h1 className="section-heading text-5xl text-center">Become a CIRC Member</h1>
      <p className="section-subheading text-center max-w-2xl mx-auto">
        Join a community of innovators and builders. Apply below to be part of the Computing Innovation and Research Club.
      </p>

      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 gap-4 mt-12">
        {benefits.map((benefit, i) => (
          <div 
            key={i} 
            className="bg-surface rounded-xl border border-border p-6 flex flex-col items-center text-center hover:border-primary hover:shadow-card transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center text-primary mb-3">
              <benefit.icon size={24} />
            </div>
            <span className="font-body text-main text-sm font-medium">
              {benefit.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
