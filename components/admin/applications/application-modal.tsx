// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
"use client"

import { X, User, GraduationCap, Mail, Phone, Calendar, CheckCircle2, XCircle, Clock } from "lucide-react"
import { format } from "date-fns"

interface ApplicationModalProps {
  application: any
  onClose: () => void
  onUpdateStatus: (id: string, status: "APPROVED" | "REJECTED") => void
}

// This function ApplicationModal handles the main work in this file and explains what this logic is doing in simple English.
export function ApplicationModal({ application, onClose, onUpdateStatus }: ApplicationModalProps) {
  if (!application) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-primary-dark/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-500">
        {/* Header */}
        <div className="p-8 lg:p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-main/10 flex items-center justify-center text-primary-main shadow-sm border border-primary-main/10">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-display font-bold text-primary-dark tracking-tight">{application.fullName}</h2>
              <p className="text-xs font-bold text-muted-main uppercase tracking-widest mt-1">Submitted {format(new Date(application.submittedAt), "MMM d, yyyy 'at' h:mm a")}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-all active:scale-95"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-slate-50">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-muted-main uppercase tracking-widest mb-1">Academic Background</p>
                <p className="text-sm font-bold text-primary-dark truncate">{application.department}</p>
                <p className="text-xs font-medium text-slate-500 mt-1">{application.year} • ID: {application.studentId}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-muted-main uppercase tracking-widest mb-1">Contact Channels</p>
                <p className="text-sm font-bold text-primary-dark truncate underline decoration-primary-main/20 underline-offset-4">{application.email}</p>
                <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1"><Phone className="w-3 h-3" /> {application.phone}</p>
              </div>
            </div>
          </div>

          {/* Communities Interest */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold text-primary-dark uppercase tracking-widest pl-1">Target Communities</h4>
            <div className="flex flex-wrap gap-2">
              {application.communities.map((c: string) => (
                <span key={c} className="px-4 py-2 bg-blue-50/50 border border-blue-100 text-blue-600 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                  {c.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>

          {/* Text Areas */}
          <div className="grid grid-cols-1 gap-10 pt-4">
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold text-primary-dark uppercase tracking-widest pl-1">Mission Alignment & Why Join</h4>
              <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100">
                <p className="text-sm font-satoshi text-primary-dark leading-relaxed whitespace-pre-wrap">{application.whyJoin}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-bold text-primary-dark uppercase tracking-widest pl-1">Technical Skills & Contributions</h4>
              <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100">
                <p className="text-sm font-satoshi text-primary-dark leading-relaxed whitespace-pre-wrap">{application.skills}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 lg:p-10 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest ${
              application.status === "PENDING" ? "bg-orange-50 border-orange-100 text-orange-600" :
              application.status === "APPROVED" ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
              "bg-red-50 border-red-100 text-red-600"
            }`}>
              {application.status === "PENDING" ? <Clock className="w-3 h-3" /> : 
               application.status === "APPROVED" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              Current Status: {application.status}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {application.status !== "REJECTED" && (
              <button 
                onClick={() => onUpdateStatus(application.id, "REJECTED")}
                className="flex-1 md:flex-none px-6 py-3 bg-white border border-red-100 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95"
              >
                Reject Application
              </button>
            )}
            {application.status !== "APPROVED" && (
              <button 
                onClick={() => onUpdateStatus(application.id, "APPROVED")}
                className="flex-1 md:flex-none px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                Approve & Admit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
