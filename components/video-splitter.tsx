"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"
import { Scissors, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { VideoUpload } from "@/components/video-upload"
import { ProcessingStatus } from "@/components/processing-status"
import { SplitResults, type VideoSegment } from "@/components/split-results"
import { ServiceWorkerRegistration } from "@/components/sw-register"
import { InstallPrompt } from "@/components/install-prompt"

type AppState = "idle" | "loading-ffmpeg" | "processing" | "done" | "error"

export function VideoSplitter() {
  const ffmpegRef = useRef<FFmpeg | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [splitDuration, setSplitDuration] = useState("30")
  const [videoDuration, setVideoDuration] = useState<number | null>(null)
  const [appState, setAppState] = useState<AppState>("idle")
  const [progress, setProgress] = useState(0)
  const [currentSegment, setCurrentSegment] = useState(0)
  const [totalSegments, setTotalSegments] = useState(0)
  const [statusMessage, setStatusMessage] = useState("")
  const [segments, setSegments] = useState<VideoSegment[]>([])
  const [errorMessage, setErrorMessage] = useState("")

  const loadFFmpeg = useCallback(async () => {
    if (ffmpegRef.current && loaded) return true
    try {
      setAppState("loading-ffmpeg")
      setStatusMessage("Loading video processor...")

      const ffmpeg = new FFmpeg()
      ffmpegRef.current = ffmpeg

      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd"
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      })

      setLoaded(true)
      return true
    } catch {
      setErrorMessage(
        "Failed to load the video processor. Please try again or use a different browser."
      )
      setAppState("error")
      return false
    }
  }, [loaded])

  const handleFileSelect = useCallback((selectedFile: File | null) => {
    setFile(selectedFile)
    setSegments([])
    setAppState("idle")
    setErrorMessage("")

    if (selectedFile) {
      const video = document.createElement("video")
      video.preload = "metadata"
      video.onloadedmetadata = () => {
        setVideoDuration(video.duration)
        URL.revokeObjectURL(video.src)

        const suggestedDuration = Math.max(1, Math.floor(video.duration / 3))
        setSplitDuration(String(Math.min(suggestedDuration, 60)))
      }
      video.src = URL.createObjectURL(selectedFile)
    } else {
      setVideoDuration(null)
    }
  }, [])

  const getFileExtension = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase()
    if (ext && ["mp4", "webm", "mov", "avi", "mkv"].includes(ext)) return ext
    return "mp4"
  }

  const handleSplit = useCallback(async () => {
    if (!file || !splitDuration) return

    const duration = parseFloat(splitDuration)
    if (isNaN(duration) || duration <= 0) {
      setErrorMessage("Please enter a valid time greater than 0.")
      setAppState("error")
      return
    }

    if (videoDuration !== null && duration > videoDuration) {
      setErrorMessage(
        "Split duration is longer than the video. Please enter a shorter time."
      )
      setAppState("error")
      return
    }

    const ffmpegLoaded = await loadFFmpeg()
    if (!ffmpegLoaded || !ffmpegRef.current) return

    try {
      setAppState("processing")
      setProgress(0)
      setSegments([])

      const ffmpeg = ffmpegRef.current
      const ext = getFileExtension(file.name)
      const inputFile = `input.${ext}`

      setStatusMessage("Reading video file...")
      const fileData = await fetchFile(file)
      await ffmpeg.writeFile(inputFile, fileData)

      const totalDur = videoDuration || 60
      const numSegments = Math.ceil(totalDur / duration)
      setTotalSegments(numSegments)

      const newSegments: VideoSegment[] = []

      for (let i = 0; i < numSegments; i++) {
        const startTime = i * duration
        const segmentEnd = Math.min(startTime + duration, totalDur)
        const outputFile = `segment_${String(i + 1).padStart(3, "0")}.${ext}`

        setCurrentSegment(i + 1)
        setStatusMessage(
          `Splitting segment ${i + 1} of ${numSegments}...`
        )

        await ffmpeg.exec([
          "-i",
          inputFile,
          "-ss",
          String(startTime),
          "-t",
          String(duration),
          "-c",
          "copy",
          "-avoid_negative_ts",
          "make_zero",
          outputFile,
        ])

        const data = await ffmpeg.readFile(outputFile)
        const mimeType = ext === "webm" ? "video/webm" : "video/mp4"
        const blob = new Blob([data], { type: mimeType })
        const url = URL.createObjectURL(blob)

        const baseName = file.name.replace(/\.[^/.]+$/, "")
        newSegments.push({
          name: `${baseName}_part${i + 1}.${ext}`,
          blob,
          url,
          index: i,
          startTime,
          endTime: segmentEnd,
        })

        await ffmpeg.deleteFile(outputFile)
        setProgress(((i + 1) / numSegments) * 100)
      }

      await ffmpeg.deleteFile(inputFile)
      setSegments(newSegments)
      setAppState("done")
    } catch (err) {
      console.error("FFmpeg processing error:", err)
      setErrorMessage(
        "An error occurred while processing the video. The file format may not be supported."
      )
      setAppState("error")
    }
  }, [file, splitDuration, videoDuration, loadFFmpeg])

  const handleDownloadAll = useCallback(() => {
    segments.forEach((segment, i) => {
      setTimeout(() => {
        const a = document.createElement("a")
        a.href = segment.url
        a.download = segment.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }, i * 500)
    })
  }, [segments])

  const handleReset = useCallback(() => {
    segments.forEach((s) => URL.revokeObjectURL(s.url))
    setFile(null)
    setSegments([])
    setAppState("idle")
    setProgress(0)
    setCurrentSegment(0)
    setTotalSegments(0)
    setStatusMessage("")
    setErrorMessage("")
    setVideoDuration(null)
    setSplitDuration("30")
  }, [segments])

  useEffect(() => {
    return () => {
      segments.forEach((s) => URL.revokeObjectURL(s.url))
    }
  }, [segments])

  const segmentCount =
    videoDuration && splitDuration && parseFloat(splitDuration) > 0
      ? Math.ceil(videoDuration / parseFloat(splitDuration))
      : null

  const isProcessing = appState === "loading-ffmpeg" || appState === "processing"

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <ServiceWorkerRegistration />
      <InstallPrompt />
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2">
          <Scissors className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-foreground leading-tight">
            Video Splitter
          </h1>
          <p className="text-xs text-muted-foreground">
            Split videos into segments
          </p>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 pb-8 max-w-lg mx-auto w-full">
        {/* Step 1: Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Select Video</CardTitle>
            <CardDescription>
              Choose a video file from your device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VideoUpload
              file={file}
              onFileSelect={handleFileSelect}
              videoDuration={videoDuration}
            />
          </CardContent>
        </Card>

        {/* Step 2: Configure */}
        {file && appState !== "done" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Split Settings</CardTitle>
              <CardDescription>
                Set the duration for each segment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="split-duration">Segment Duration (seconds)</Label>
                  <Input
                    id="split-duration"
                    type="number"
                    min="1"
                    max={videoDuration ? String(Math.floor(videoDuration)) : undefined}
                    step="1"
                    value={splitDuration}
                    onChange={(e) => {
                      setSplitDuration(e.target.value)
                      setErrorMessage("")
                      setAppState("idle")
                    }}
                    placeholder="e.g. 30"
                    disabled={isProcessing}
                    className="font-mono"
                  />
                </div>

                {segmentCount !== null && (
                  <div className="flex items-start gap-2 rounded-md bg-secondary/50 p-3">
                    <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This will create{" "}
                      <span className="font-medium text-foreground">
                        {segmentCount} segment{segmentCount !== 1 ? "s" : ""}
                      </span>
                      , each approximately{" "}
                      <span className="font-medium text-foreground font-mono">
                        {splitDuration}s
                      </span>{" "}
                      long.
                    </p>
                  </div>
                )}

                {appState === "error" && errorMessage && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
                    <p className="text-xs text-destructive">{errorMessage}</p>
                  </div>
                )}

                {isProcessing ? (
                  <ProcessingStatus
                    progress={progress}
                    currentSegment={currentSegment}
                    totalSegments={totalSegments}
                    statusMessage={statusMessage}
                  />
                ) : (
                  <Button
                    onClick={handleSplit}
                    className="w-full"
                    size="lg"
                    disabled={!file || !splitDuration}
                  >
                    <Scissors className="size-4" />
                    Split Video
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Results */}
        {appState === "done" && segments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Segments</CardTitle>
              <CardDescription>
                Download to your device storage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SplitResults
                segments={segments}
                onDownloadAll={handleDownloadAll}
                onReset={handleReset}
              />
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="border-t border-border px-4 py-3">
        <p className="text-center text-xs text-muted-foreground">
          All processing happens locally on your device. No files are uploaded to any server.
        </p>
        <p className="text-center text-xs text-muted-foreground mt-2">
          v1.0.0
        </p>
      </footer>
    </div>
  )
}
