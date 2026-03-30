// Description: Toast with upload progress simulation
// Order: 10

"use client"

import { useRef } from "react"
import { toast } from "sonner"

import { Button } from "@/registry/bases/base/ui/button"
import { Progress } from "@/registry/bases/base/ui/progress"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function UploadToast({ progress }: { progress: number }) {
  const done = progress >= 100

  return (
    <div className="bg-popover text-popover-foreground border-border style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-3xl style-mira:rounded-md flex w-[350px] flex-col gap-3 border p-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="bg-muted flex size-8 shrink-0 items-center justify-center">
          <IconPlaceholder
            lucide="FileIcon"
            tabler="IconFile"
            hugeicons="FileEmpty02Icon"
            phosphor="FileIcon"
            remixicon="RiFileLine"
            className="size-4"
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <p className="text-sm font-medium">report-q4-2025.pdf</p>
          <p className="text-muted-foreground text-xs">
            2.4 MB &middot; {done ? "Complete" : `Uploading... ${progress}%`}
          </p>
        </div>
      </div>
      <Progress
        value={progress}
        className="**:data-[slot=progress-indicator]:bg-success **:data-[slot=progress-track]:h-1.5"
      />
    </div>
  )
}

export default function Pattern() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const showUploadToast = () => {
    let progress = 0
    const id = toast.custom(() => <UploadToast progress={progress} />, {
      duration: Infinity,
    })

    intervalRef.current = setInterval(() => {
      progress = Math.min(progress + Math.floor(Math.random() * 15) + 5, 100)

      toast.custom(() => <UploadToast progress={progress} />, {
        id,
        duration: progress >= 100 ? 3000 : Infinity,
      })

      if (progress >= 100 && intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }, 500)
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={showUploadToast} variant="outline" className="w-fit">
        Upload Toast
      </Button>
    </div>
  )
}
