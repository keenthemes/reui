// Description: Zoom controls button group
// Order: 37

"use client"

import { useState } from "react"

import { Button } from "@/registry/bases/base/ui/button"
import {
  ButtonGroup,
  ButtonGroupText,
} from "@/registry/bases/base/ui/button-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [zoom, setZoom] = useState(100)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 10))
  }

  return (
    <ButtonGroup>
      <Button
        variant="outline"
        size="icon"
        aria-label="Zoom out"
        onClick={handleZoomOut}
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
      <ButtonGroupText className="w-16 justify-center">{zoom}%</ButtonGroupText>
      <Button
        variant="outline"
        size="icon"
        aria-label="Zoom in"
        onClick={handleZoomIn}
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
