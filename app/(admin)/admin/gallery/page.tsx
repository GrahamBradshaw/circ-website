// This file is part of the CIRC website.
// It belongs to the app layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
"use client"

import { useState, useEffect, useRef } from "react"
import { Upload, Trash2, Loader2, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface GalleryImage {
  id: string
  url: string
  caption: string | null
  event?: { id: string; title: string } | null
  eventId?: string | null
}

interface Event {
  id: string
  title: string
}

// This function AdminGalleryPage handles the main work in this file and explains what this logic is doing in simple English.
export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [uploading, setUploading] = useState<{ name: string; progress: number }[]>([])
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null)
  
  function showToast(msg: string, type: 'success'|'error' = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [galleryRes, eventsRes] = await Promise.all([
          fetch("/api/gallery"),
          fetch("/api/events")
        ])
        if (galleryRes.ok && eventsRes.ok) {
          const galleryData = await galleryRes.json()
          const eventsData = await eventsRes.json()
          setImages(Array.isArray(galleryData.data) ? galleryData.data : [])
          setHasMore(Boolean(galleryData.pagination?.hasMore))
          setEvents(Array.isArray(eventsData.data) ? eventsData.data : [])
        }
      } catch (err) {
        console.error("Failed to fetch data:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  async function loadMoreImages() {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const response = await fetch(`/api/gallery?skip=${images.length}&limit=24`)
      const result = await response.json()
      if (response.ok && result.success) {
        setImages((current) => [...current, ...result.data])
        setHasMore(result.pagination.hasMore)
      }
    } catch {
      showToast("Could not load more images", "error")
    } finally {
      setLoadingMore(false)
    }
  }

  async function handleUpload(files: FileList | File[]) {
    const fileArray = Array.from(files)
    for (const file of fileArray) {
      const formData = new FormData()
      formData.append("file", file)

      // IMPORTANT: Do NOT set Content-Type header manually for FormData
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
      const uploadData = await uploadRes.json()

      if (!uploadData.success) {
        showToast("Upload failed: " + uploadData.error, "error")
        continue
      }

      const saveRes = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: uploadData.url, caption: "", eventId: null }),
      })

      const saveData = await saveRes.json()
      if (saveData.success) {
        setImages(prev => [saveData.data, ...prev])
        showToast("Photo uploaded successfully", "success")
      } else {
        showToast("Failed to save image record", "error")
      }
    }
  }

  const updateImage = async (id: string, data: Partial<GalleryImage>) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        setImages(prev => prev.map(img => img.id === id ? { ...img, ...data } : img))
        showToast("Image updated", "success")
      } else {
        showToast("Update failed", "error")
      }
    } catch (err) {
      console.error(err)
      showToast("Update failed", "error")
    }
  }

  const deleteImage = async (id: string) => {
    if (!confirm("Delete this image?")) return
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" })
      if (res.ok) {
        setImages(prev => prev.filter(img => img.id !== id))
        showToast("Image deleted", "success")
      } else {
        showToast("Delete failed", "error")
      }
    } catch (err) {
      console.error(err)
      showToast("Delete failed", "error")
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 font-body text-sm px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-accent-green text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-primary text-2xl font-bold">Gallery Management</h1>
          <p className="font-body text-muted text-sm mt-1">Upload and organize images from club activities.</p>
        </div>
      </div>

      {/* Upload Zone */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary hover:bg-surface-2 transition-all cursor-pointer bg-surface group"
      >
        <Upload className="w-16 h-16 text-muted mx-auto mb-4 group-hover:text-primary transition-colors" />
        <p className="font-body text-main text-sm font-semibold">Click to upload images</p>
        <p className="font-body text-muted text-xs mt-1">Multi-selection supported. JPG, PNG, WEBP files.</p>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple 
          accept="image/*" 
          onChange={(e) => e.target.files && handleUpload(e.target.files)} 
        />
      </div>

      {/* Upload Queue */}
      {uploading.length > 0 && (
        <div className="space-y-2 mt-6">
          <p className="font-body text-xs font-bold uppercase tracking-widest text-muted mb-2">Uploading...</p>
          {uploading.map((u, i) => (
            <div key={i} className="flex items-center gap-3 bg-surface-2 rounded-lg px-4 py-3 border border-border">
              <div className="w-8 h-8 rounded bg-surface/50 flex items-center justify-center">
                <ImageIcon size={16} className="text-primary" />
              </div>
              <p className="font-body text-main text-sm flex-1 truncate">{u.name}</p>
              <div className="w-32 h-1.5 bg-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent-orange transition-all duration-300" 
                  style={{ width: `${u.progress}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Existing Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
        {images.map((img) => (
          <div key={img.id} className="bg-surface rounded-xl border border-border overflow-hidden flex flex-col hover:shadow-card transition-all">
            <div className="aspect-square relative w-full group">
              <Image 
                src={img.url} 
                alt={img.caption || "Gallery Image"} 
                fill 
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <p className="text-white text-[10px] font-mono uppercase">Preview</p>
              </div>
            </div>
            
            <div className="p-4 space-y-3 flex-1 flex flex-col">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted uppercase tracking-widest pl-1">Caption</label>
                <input 
                  defaultValue={img.caption || ""}
                  onBlur={(e) => updateImage(img.id, { caption: e.target.value })}
                  placeholder="Add a caption..."
                  className="w-full text-xs font-body border border-border rounded-lg px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted uppercase tracking-widest pl-1">Related Event</label>
                <select 
                  value={img.eventId || ""}
                  onChange={(e) => updateImage(img.id, { eventId: e.target.value || null })}
                  className="w-full text-xs font-body border border-border rounded-lg px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-surface"
                >
                  <option value="">No Event</option>
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={() => deleteImage(img.id)}
                className="w-full btn-outline text-red-500 border-red-100 hover:bg-red-50 text-xs py-2 mt-2 flex items-center justify-center gap-1.5"
              >
                <Trash2 size={13} />
                Delete Image
              </button>
            </div>
          </div>
        ))}
        {images.length === 0 && !isLoading && (
          <div className="col-span-full py-20 bg-surface-2 rounded-2xl border border-dashed border-border text-center">
             <p className="font-body text-muted italic">No images in gallery yet.</p>
          </div>
        )}
      </div>
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={loadMoreImages}
            disabled={loadingMore}
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-primary disabled:opacity-60"
          >
            {loadingMore ? "Loading…" : "Load more images"}
          </button>
        </div>
      )}
    </div>
  )
}
