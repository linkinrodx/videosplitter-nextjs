"use client"

import { useCallback, useRef, useState } from "react"
import { Upload, Film, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoUploadProps {
  file: File | null
  onFileSelect: (file: File | null) => void
  videoDuration: number | null
}

export function VideoUpload({ file, onFileSelect, videoDuration }: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const videoPreviewRef = useRef<HTMLVideoElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile && droppedFile.type.startsWith("video/")) {
        onFileSelect(droppedFile)
      }
    },
    [onFileSelect]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        onFileSelect(selectedFile)
      }
    },
    [onFileSelect]
  )

  const handleRemove = useCallback(() => {
    onFileSelect(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }, [onFileSelect])

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + " GB"
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + " MB"
    return (bytes / 1024).toFixed(1) + " KB"
  }

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  if (file) {
    return (
      <div className="flex flex-col gap-4">
        <div className="relative overflow-hidden rounded-lg border border-border bg-secondary/50">
          <video
            ref={videoPreviewRef}
            src={URL.createObjectURL(file)}
            className="w-full max-h-48 object-contain bg-background"
            controls
            playsInline
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 flex items-center justify-center rounded-full bg-background/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
            aria-label="Remove video"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3">
          <div className="flex items-center justify-center rounded-md bg-primary/10 p-2">
            <Film className="size-5 text-primary" />
          </div>
          <div className="flex flex-col gap-0.5 overflow-hidden">
            <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
              {videoDuration !== null && ` \u00B7 ${formatDuration(videoDuration)}`}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-secondary/30"
      )}
    >
      <div className="flex items-center justify-center rounded-full bg-primary/10 p-3">
        <Upload className="size-6 text-primary" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-medium text-foreground">
          Tap to select a video
        </p>
        <p className="text-xs text-muted-foreground">
          or drag and drop here
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        MP4, WebM, MOV, AVI supported
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={handleInputChange}
        className="sr-only"
        aria-label="Select video file"
      />
    </div>
  )
}
