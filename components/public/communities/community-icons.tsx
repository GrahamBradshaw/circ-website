// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import React from "react"

// This constant COMMUNITY_ICONS stores shared values used by this file so the logic stays easier to follow.
export const COMMUNITY_ICONS: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {

  "web-development": ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.7"/>
      <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.4"/>
    </svg>
  ),

  "ai-ml": ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
      <circle cx="4" cy="6" r="1.8" fill="currentColor" opacity="0.6"/>
      <circle cx="20" cy="6" r="1.8" fill="currentColor" opacity="0.6"/>
      <circle cx="4" cy="18" r="1.8" fill="currentColor" opacity="0.6"/>
      <circle cx="20" cy="18" r="1.8" fill="currentColor" opacity="0.6"/>
      <circle cx="4" cy="12" r="1.8" fill="currentColor" opacity="0.3"/>
      <circle cx="20" cy="12" r="1.8" fill="currentColor" opacity="0.3"/>
      <line x1="5.8" y1="7" x2="10.2" y2="10.8" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="18.2" y1="7" x2="13.8" y2="10.8" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="5.8" y1="17" x2="10.2" y2="13.2" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="18.2" y1="17" x2="13.8" y2="13.2" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="5.8" y1="12" x2="9.5" y2="12" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
      <line x1="18.2" y1="12" x2="14.5" y2="12" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
    </svg>
  ),

  "data-science": ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="12" width="3" height="9" rx="1" fill="currentColor" opacity="0.9"/>
      <rect x="8" y="8" width="3" height="13" rx="1" fill="currentColor" opacity="0.7"/>
      <rect x="13" y="5" width="3" height="16" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="18" y="2" width="3" height="19" rx="1" fill="currentColor" opacity="0.3"/>
      <path d="M4.5 11L9.5 7.5 14.5 4.5 19.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 2"/>
    </svg>
  ),

  "web3-blockchain": ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none">
      <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <polygon points="12,7 17,9.5 17,14.5 12,17 7,14.5 7,9.5" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.12"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
      <line x1="12" y1="2" x2="12" y2="7" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      <line x1="12" y1="17" x2="12" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      <line x1="3" y1="7" x2="7" y2="9.5" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      <line x1="21" y1="7" x2="17" y2="9.5" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      <line x1="3" y1="17" x2="7" y2="14.5" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      <line x1="21" y1="17" x2="17" y2="14.5" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    </svg>
  ),

  "iot": ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none">
      <rect x="7" y="9" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="10" y1="9" x2="10" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <line x1="14" y1="9" x2="14" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <line x1="7" y1="12.5" x2="17" y2="12.5" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <line x1="9" y1="16" x2="9" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15" y1="16" x2="15" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="6" y1="19" x2="18" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5 7c1.1-1.1 2.6-1.8 4.2-1.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
      <path d="M3 5c2-2 4.8-3.2 7.7-3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.3"/>
      <path d="M19 7c-1.1-1.1-2.6-1.8-4.2-1.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
      <path d="M21 5c-2-2-4.8-3.2-7.7-3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.3"/>
    </svg>
  ),

  "programming": ({ className, style }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none">
      <path d="M8 6L3 12l5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 6l5 6-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.5 3.5l-5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),
  "networking-cybersecurity": ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
      <path d="M12 17.5v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  gdg: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 12h4v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 8h-4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

// This constant COMMUNITY_COLORS stores shared values used by this file so the logic stays easier to follow.
export const COMMUNITY_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  "web-development":  { bg: "#EFF6FF", text: "#1E40AF", icon: "#1E3A8A" },
  "ai-ml":            { bg: "#F0FDF4", text: "#15803D", icon: "#16A34A" },
  "data-science":     { bg: "#FFF7ED", text: "#C2410C", icon: "#F97316" },
  "web3-blockchain":  { bg: "#F5F3FF", text: "#6D28D9", icon: "#8B5CF6" },
  "iot":              { bg: "#F0FDFA", text: "#0F766E", icon: "#14B8A6" },
  "programming":      { bg: "#FFF1F2", text: "#BE123C", icon: "#F43F5E" },
  "networking-cybersecurity": { bg: "#FFF1F2", text: "#BE123C", icon: "#E11D48" },
  "gdg":              { bg: "#EFF6FF", text: "#1D4ED8", icon: "#2563EB" },
}
