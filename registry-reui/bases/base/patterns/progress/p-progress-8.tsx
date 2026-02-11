// Description: Progress bar with custom colors.
// Order: 8

"use client"

import { useEffect, useState } from "react"

import { Progress } from "@/registry/bases/base/ui/progress"

export default function Pattern() {
  const [progress, setProgress] = useState(45)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(75), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-6">
      <Progress
        value={progress}
        className="**:data-[slot=progress-indicator]:bg-green-500"
      ></Progress>
      <Progress
        value={progress}
        className="**:data-[slot=progress-indicator]:bg-yellow-500"
      ></Progress>
      <Progress
        value={progress}
        className="**:data-[slot=progress-indicator]:bg-fuchsia-500"
      ></Progress>
      <Progress
        value={progress}
        className="**:data-[slot=progress-indicator]:bg-indigo-500"
      ></Progress>
      <Progress
        value={progress}
        className="**:data-[slot=progress-indicator]:bg-violet-500"
      ></Progress>
    </div>
  )
}
