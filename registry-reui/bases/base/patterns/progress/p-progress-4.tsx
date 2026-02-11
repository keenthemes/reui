// Description: Progress bar with status messages.
// Order: 4

"use client"

import { useEffect, useState } from "react"

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/registry/bases/base/ui/progress"

export default function BaseProgressStatus() {
  const [downloadProgress, setDownloadProgress] = useState(0)

  // Get status message based on progress
  const getStatusMessage = (progress: number) => {
    if (progress < 5) return "Initializing download..."
    if (progress < 15) return "Setting up environment..."
    if (progress < 25) return "Connecting to server..."
    if (progress < 35) return "Verifying permissions..."
    if (progress < 50) return "Downloading core files..."
    if (progress < 65) return "Downloading assets..."
    if (progress < 80) return "Downloading dependencies..."
    if (progress < 90) return "Extracting files..."
    if (progress < 95) return "Validating integrity..."
    if (progress < 100) return "Finalizing installation..."
    return "Download complete!"
  }

  useEffect(() => {
    // Download simulation
    const downloadTimer = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          return 0 // Reset for continuous loop
        }
        return prev + Math.random() * 3 + 1 // Random increment 1-4
      })
    }, 150)

    return () => {
      clearInterval(downloadTimer)
    }
  }, [])

  return (
    <div className="w-full max-w-xs space-y-2">
      <Progress value={downloadProgress}>
        <ProgressLabel>Workspace Setup</ProgressLabel>
        <ProgressValue />
      </Progress>
      <div className="text-muted-foreground style-vega:text-sm style-lyra:text-xs style-maia:text-xs style-nova:text-xs style-mira:text-xs">
        {getStatusMessage(downloadProgress)}
      </div>
    </div>
  )
}
