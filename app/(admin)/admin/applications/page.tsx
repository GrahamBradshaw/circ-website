'use client'

import { useEffect, useState } from "react"
import { CheckCircle, XCircle, Eye } from "lucide-react"

type Application = {
  id: string
  fullName: string
  studentId: string
  department: string
  year: string
  email: string
  phone: string
  communities: string[]
  whyJoin: string
  skills: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  submittedAt: string
}

const STATUS_FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"]

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("ALL")
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({})
  const [refreshKey, setRefreshKey] = useState(0)
  const [selected, setSelected] = useState<Application | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    const controller = new AbortController()
    async function fetchApplications() {
      setLoading(true)
      try {
        const query = new URLSearchParams({ page: String(page) })
        if (filter !== "ALL") query.set("status", filter)
        const response = await fetch(`/api/applications?${query.toString()}`, { signal: controller.signal })
        const result = await response.json()
        if (result.success) {
          setApplications(result.data)
          setTotal(result.pagination.total)
          const nextPageCount = result.pagination.totalPages
          setPageCount(nextPageCount)
          setStatusCounts(result.statusCounts)
          if (page > nextPageCount) setPage(nextPageCount)
        }
      } catch (error) {
        if (!controller.signal.aborted) console.error("Failed to load applications", error)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void fetchApplications()
    return () => controller.abort()
  }, [filter, page, refreshKey])

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: status as any } : a))
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: status as any } : null)
      setRefreshKey((key) => key + 1)
      showToast(`Application ${status.toLowerCase()}`)
    }
  }

  const badgeClass = (s: string) => {
    if (s === "APPROVED") return "bg-green-50 text-green-700"
    if (s === "REJECTED") return "bg-red-50 text-red-700"
    return "bg-orange-50 text-orange-700"
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-primary text-white font-body text-sm px-5 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="font-display text-primary text-2xl font-bold">Applications</h1>
        <span className="font-body text-muted text-sm">{total} total</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => { setPage(1); setFilter(f) }}
            className={`font-body text-sm px-4 py-2 rounded-full border transition-all ${
              filter === f ? "bg-primary text-white border-primary" : "border-border text-muted hover:border-primary hover:text-primary"
            }`}
          >
              {f} ({f === "ALL" ? total : statusCounts[f] ?? 0})
          </button>
        ))}
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center font-body text-muted text-sm">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center font-body text-muted text-sm italic">No applications found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-2">
              <tr>
                {["Name","Student ID","Department","Year","Communities","Date","Status","Actions"].map(h => (
                  <th key={h} className="font-body text-muted text-xs font-semibold uppercase tracking-wider px-4 py-3 text-left border-b border-border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id} className="hover:bg-surface-2 transition-colors">
                  <td className="px-4 py-4 border-b border-border">
                    <div className="font-body text-main text-sm font-medium">{app.fullName}</div>
                    <div className="font-body text-muted text-xs">{app.email}</div>
                  </td>
                  <td className="px-4 py-4 border-b border-border font-body text-main text-sm">{app.studentId}</td>
                  <td className="px-4 py-4 border-b border-border font-body text-main text-sm">{app.department}</td>
                  <td className="px-4 py-4 border-b border-border font-body text-main text-sm">{app.year}</td>
                  <td className="px-4 py-4 border-b border-border">
                    <span className="font-body text-muted text-xs">{app.communities.length} selected</span>
                  </td>
                  <td className="px-4 py-4 border-b border-border font-body text-muted text-xs">
                    {new Date(app.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 border-b border-border">
                    <span className={`font-body text-xs font-medium px-2.5 py-1 rounded-full ${badgeClass(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-b border-border">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(app)} className="p-1.5 rounded-md text-muted hover:text-primary hover:bg-surface-2 transition-colors" title="View">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => updateStatus(app.id, "APPROVED")} className="p-1.5 rounded-md text-muted hover:text-green-600 hover:bg-green-50 transition-colors" title="Approve">
                        <CheckCircle size={14} />
                      </button>
                      <button onClick={() => updateStatus(app.id, "REJECTED")} className="p-1.5 rounded-md text-muted hover:text-red-500 hover:bg-red-50 transition-colors" title="Reject">
                        <XCircle size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && total > 0 && (
        <div className="flex items-center justify-between gap-4">
          <span className="font-body text-muted text-sm">Page {page} of {pageCount}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-50"
            >Previous</button>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
              disabled={page >= pageCount}
              className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-50"
            >Next</button>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-surface rounded-2xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-primary text-xl font-bold">{selected.fullName}</h2>
              <span className={`font-body text-xs font-medium px-3 py-1.5 rounded-full ${badgeClass(selected.status)}`}>{selected.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[["Student ID", selected.studentId],["Department", selected.department],["Year", selected.year],["Email", selected.email],["Phone", selected.phone]].map(([l,v]) => (
                <div key={l}>
                  <p className="font-body text-muted text-xs uppercase tracking-wider mb-1">{l}</p>
                  <p className="font-body text-main text-sm">{v}</p>
                </div>
              ))}
              <div>
                <p className="font-body text-muted text-xs uppercase tracking-wider mb-1">Communities</p>
                <div className="flex flex-wrap gap-1">{selected.communities.map(c => <span key={c} className="tag-sky text-xs">{c}</span>)}</div>
              </div>
            </div>
            <div className="mb-4">
              <p className="font-body text-muted text-xs uppercase tracking-wider mb-2">Why join CIRC</p>
              <div className="bg-surface-2 rounded-lg p-3 font-body text-main text-sm leading-relaxed">{selected.whyJoin}</div>
            </div>
            <div className="mb-6">
              <p className="font-body text-muted text-xs uppercase tracking-wider mb-2">Skills</p>
              <div className="bg-surface-2 rounded-lg p-3 font-body text-main text-sm leading-relaxed">{selected.skills}</div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => updateStatus(selected.id, "APPROVED")} className="btn-primary flex-1 justify-center text-sm py-2.5">Approve</button>
              <button onClick={() => updateStatus(selected.id, "REJECTED")} className="flex-1 justify-center text-sm py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-body font-medium transition-colors">Reject</button>
              <button onClick={() => setSelected(null)} className="btn-outline px-4 text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
