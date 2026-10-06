// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Grid3x3, User, ArrowRight, Layers } from "lucide-react"

// This function AdminCommunitiesPage handles the main work in this file and explains what this logic is doing in simple English.
export default async function AdminCommunitiesPage() {
  const communities = await prisma.community.findMany({
    include: {
      lead: {
        select: { name: true, photo: true }
      },
      _count: {
        select: { events: true }
      }
    },
    orderBy: { name: "asc" },
  })

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary-dark tracking-tight">Communities</h1>
        <p className="text-sm text-muted-main mt-1">Manage interest groups, leads, and specialized activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {communities.map((c) => (
          <div key={c.id} className="group bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary-main/5 hover:-translate-y-1 transition-all">
            <div className="relative h-32 bg-slate-100 overflow-hidden">
              {c.heroImage ? (
                <Image src={c.heroImage} alt={c.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px" className="object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-main/5 to-primary-main/20 flex items-center justify-center">
                  <Grid3x3 className="w-8 h-8 text-primary-main/20" />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white to-transparent" />
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-xl font-display font-bold text-primary-dark group-hover:text-primary-main transition-colors">{c.name}</h3>
                <p className="text-[10px] font-bold text-muted-main uppercase tracking-widest mt-1">Slug: /communities/{c.slug}</p>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white border border-slate-200 shrink-0">
                  {c.lead?.photo ? (
                    <Image src={c.lead.photo} alt={c.lead.name} fill sizes="96px" className="object-cover" />
                  ) : (
                    <User className="w-full h-full p-1.5 text-slate-300" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-muted-main uppercase tracking-widest leading-none mb-1">Current Lead</p>
                  <p className="text-xs font-bold text-primary-dark truncate">{c.lead?.name || "Unassigned"}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2 text-muted-main">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{c._count.events} Events</span>
                </div>
                <Link 
                  href={`/admin/communities/${c.slug}`}
                  className="flex items-center gap-1 text-primary-main hover:text-accent-orange transition-colors group/btn"
                >
                  Configure <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
