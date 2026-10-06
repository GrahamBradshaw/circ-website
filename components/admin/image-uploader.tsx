// This file is part of the CIRC website.
// It belongs to the component layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
'use client'

import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

// This function ImageUploader handles the main work in this file and explains what this logic is doing in simple English.
export function ImageUploader({ value, onChange, label = "Image" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file) return
    setUploading(true)
    setProgress(0)
    setError(null)

    // Simulate progress while uploading
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 8, 85))
    }, 200)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!data.success) throw new Error(data.error || "Upload failed")

      clearInterval(progressInterval)
      setProgress(100)
      onChange(data.url)
    } catch (err: any) {
      clearInterval(progressInterval)
      setError(err.message || "Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  if (value) {
    return (
      <div className="relative w-full">
        <div className="relative h-48 rounded-xl overflow-hidden border border-border">
          <Image src={value} alt={label} fill sizes="400px" className="object-cover" />
        </div>
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-surface-2 transition-all"
      >
        <ImageIcon size={32} className="text-muted mx-auto mb-3" />
        <p className="font-body text-sm text-muted">Click or drag image here</p>
        <p className="font-body text-xs text-muted/70 mt-1">PNG, JPG, WEBP up to 10MB</p>
      </div>

      {uploading && (
        <div className="mt-3">
          <div className="flex justify-between mb-1">
            <span className="font-body text-xs text-muted">Uploading...</span>
            <span className="font-body text-xs text-muted">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-green transition-all duration-200 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <p className="font-body text-xs text-red-500 mt-2">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  )
}
