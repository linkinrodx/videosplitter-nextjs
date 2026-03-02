"use client"

import { useEffect, useRef } from "react"

export function ServiceWorkerRegistration() {
  const registered = useRef(false)

  useEffect(() => {
    if (registered.current) return
    registered.current = true

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {
          // Service worker registration failed silently
        })
    }
  }, [])

  return null
}
