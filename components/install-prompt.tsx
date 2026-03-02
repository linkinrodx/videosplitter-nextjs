"use client"

import { useCallback, useEffect, useState } from "react"
import { Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener("beforeinstallprompt", handler)

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
    }
  }, [deferredPrompt])

  if (isInstalled || dismissed || !deferredPrompt) return null

  return (
    <div className="flex items-center gap-3 border-b border-primary/20 bg-primary/5 px-4 py-2.5">
      <Download className="size-4 shrink-0 text-primary" />
      <p className="flex-1 text-xs text-foreground leading-relaxed">
        Install this app on your device for quick access
      </p>
      <div className="flex items-center gap-1">
        <Button size="sm" variant="default" onClick={handleInstall} className="h-7 text-xs px-3">
          Install
        </Button>
        <button
          onClick={() => setDismissed(true)}
          className="flex items-center justify-center rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Dismiss install prompt"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
