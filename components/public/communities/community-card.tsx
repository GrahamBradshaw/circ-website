// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import Link from "next/link"
import { Globe2, BarChart2, Brain, Link2, Code2, Wifi, ArrowRight, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap = {
  WEB_DEV: Globe2,
  DATA_SCIENCE: BarChart2,
  AI_ML: Brain,
  WEB3_BLOCKCHAIN: Link2,
  PROGRAMMING: Code2,
  IOT: Wifi,
  NETWORKING_CYBERSECURITY: Shield,
}

interface CommunityCardProps {
  name: string
  slug: string
  description: string
  focusTags: string[]
  type: string
}

// This function CommunityCard handles the main work in this file and explains what this logic is doing in simple English.
export function CommunityCard({ name, slug, description, focusTags, type }: CommunityCardProps) {
  const Icon = iconMap[type as keyof typeof iconMap] || Code2

  return (
    <Link 
      href={`/communities/${slug}`}
      className="card-hover group cursor-pointer border-l-4 border-l-transparent hover:border-l-accent-orange flex flex-col h-full"
    >
      <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center mb-4 text-primary group-hover:text-accent-orange transition-colors">
        <Icon size={24} />
      </div>
      
      <h3 className="font-display text-primary text-lg font-semibold mb-2 group-hover:text-accent-orange transition-colors">
        {name}
      </h3>
      
      <p className="font-body text-muted text-sm leading-relaxed line-clamp-2 mb-4">
        {description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {focusTags.slice(0, 3).map((tag, i) => (
          <span key={i} className="tag-sky">
            {tag}
          </span>
        ))}
      </div>

      <div className="font-body text-accent-orange text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
        Learn More
        <ArrowRight size={14} />
      </div>
    </Link>
  )
}
