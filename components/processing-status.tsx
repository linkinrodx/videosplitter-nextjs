"use client"

import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

interface ProcessingStatusProps {
  progress: number
  currentSegment: number
  totalSegments: number
  statusMessage: string
}

export function ProcessingStatus({
  progress,
  currentSegment,
  totalSegments,
  statusMessage,
}: ProcessingStatusProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-secondary/30 p-5">
      <div className="flex items-center gap-3">
        <Loader2 className="size-5 shrink-0 animate-spin text-primary" />
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium text-foreground">
            Processing Video
          </p>
          <p className="text-xs text-muted-foreground">
            {statusMessage}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Progress value={progress} className="h-2.5" />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-mono">
            Segment {currentSegment} of {totalSegments}
          </p>
          <p className="text-xs font-medium text-primary font-mono">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </div>
  )
}
