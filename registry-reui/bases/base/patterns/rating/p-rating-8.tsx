// Description: Emoji reaction rating
// Order: 8

"use client"

import { useState } from "react"

import { cn } from "@/registry/bases/base/lib/utils"

const emojis = [
  { value: 1, emoji: "😞", label: "Terrible" },
  { value: 2, emoji: "😕", label: "Bad" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "😊", label: "Good" },
  { value: 5, emoji: "🤩", label: "Amazing" },
]

export default function Pattern() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-3">
      <p className="text-sm font-medium">How was your experience?</p>
      <div className="flex gap-2">
        {emojis.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setSelected(item.value)}
            className={cn(
              "style-vega:rounded-lg style-lyra:rounded-none style-maia:rounded-lg style-nova:rounded-lg style-mira:rounded-md flex size-10 items-center justify-center border-2 text-2xl transition-all",
              selected === item.value
                ? "border-border bg-muted scale-110"
                : "hover:bg-muted border-transparent"
            )}
          >
            {item.emoji}
          </button>
        ))}
      </div>
      {selected && (
        <p className="text-muted-foreground text-sm">
          {emojis.find((e) => e.value === selected)?.label}
        </p>
      )}
    </div>
  )
}
