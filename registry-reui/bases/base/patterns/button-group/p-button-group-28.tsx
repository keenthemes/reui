// Description: Volume controller with plus/minus actions
// Order: 28

"use client"

import { useState } from "react"

import { Button } from "@/registry/bases/base/ui/button"
import { ButtonGroup } from "@/registry/bases/base/ui/button-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)

  const increaseVolume = () => {
    setVolume((prev) => Math.min(prev + 5, 100))
    setIsMuted(false)
  }

  const decreaseVolume = () => {
    setVolume((prev) => {
      const next = Math.max(prev - 5, 0)
      if (next === 0) setIsMuted(true)
      return next
    })
  }

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  return (
    <ButtonGroup>
      <Button
        onClick={decreaseVolume}
        size="sm"
        variant="outline"
        aria-label="Decrease Volume"
      >
        <IconPlaceholder
          lucide="MinusIcon"
          tabler="IconMinus"
          hugeicons="MinusSignIcon"
          phosphor="MinusIcon"
          remixicon="RiSubtractLine"
          aria-hidden="true"
        />
      </Button>
      <Button
        onClick={toggleMute}
        size="sm"
        variant="outline"
        className="min-w-20"
      >
        {isMuted ? "Muted" : `${volume}%`}
      </Button>
      <Button
        onClick={increaseVolume}
        size="sm"
        variant="outline"
        aria-label="Increase Volume"
      >
        <IconPlaceholder
          lucide="PlusIcon"
          tabler="IconPlus"
          hugeicons="PlusSignIcon"
          phosphor="PlusIcon"
          remixicon="RiAddLine"
          aria-hidden="true"
        />
      </Button>
    </ButtonGroup>
  )
}
