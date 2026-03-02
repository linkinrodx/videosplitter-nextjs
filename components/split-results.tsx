"use client"

import { Download, Play, CheckCircle2, FileVideo } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface VideoSegment {
  name: string
  blob: Blob
  url: string
  index: number
  startTime: number
  endTime: number
}

interface SplitResultsProps {
  segments: VideoSegment[]
  onDownloadAll: () => void
  onReset: () => void
}

export function SplitResults({ segments, onDownloadAll, onReset }: SplitResultsProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + " MB"
    return (bytes / 1024).toFixed(1) + " KB"
  }

  const handleDownload = (segment: VideoSegment) => {
    const a = document.createElement("a")
    a.href = segment.url
    a.download = segment.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
        <CheckCircle2 className="size-5 shrink-0 text-primary" />
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium text-foreground">
            Split Complete
          </p>
          <p className="text-xs text-muted-foreground">
            {segments.length} segment{segments.length !== 1 ? "s" : ""} created
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {segments.map((segment) => (
          <div
            key={segment.index}
            className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3 transition-colors hover:bg-secondary/50"
          >
            <div className="flex items-center justify-center rounded-md bg-primary/10 p-2">
              <FileVideo className="size-4 text-primary" />
            </div>
            <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">
                {segment.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatTime(segment.startTime)} - {formatTime(segment.endTime)} {"\u00B7"} {formatFileSize(segment.blob.size)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => {
                  const w = window.open("", "_blank")
                  if (w) {
                    w.document.write(`<video src="${segment.url}" controls autoplay style="max-width:100%;max-height:100vh;margin:auto;display:block;background:#000;"></video>`)
                  }
                }}
                aria-label={`Preview segment ${segment.index + 1}`}
              >
                <Play className="size-4" />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => handleDownload(segment)}
                aria-label={`Download segment ${segment.index + 1}`}
              >
                <Download className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={onDownloadAll} className="w-full">
          <Download className="size-4" />
          Download All Segments
        </Button>
        <Button variant="outline" onClick={onReset} className="w-full">
          Split Another Video
        </Button>
      </div>
    </div>
  )
}
