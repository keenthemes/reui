// Description: State-tracked resizable layout.
// Order: 10
// GridSize: 1

"use client"

import { useState } from "react"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/bases/base/ui/resizable"

export default function Pattern() {
  const [sizes, setSizes] = useState<Record<string, number>>({
    left: 30,
    right: 70,
  })

  return (
    <div className="mx-auto w-full max-w-lg">
      <ResizablePanelGroup
        orientation="horizontal"
        className="style-vega:rounded-lg style-lyra:rounded-none style-maia:rounded-2xl style-nova:rounded-2xl style-mira:rounded-md min-h-[200px] border"
        onLayoutChange={(layout) => {
          setSizes(layout)
        }}
      >
        <ResizablePanel id="left" defaultSize={30} minSize={20}>
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
            <span className="text-sm font-semibold">
              {Math.round(sizes.left ?? 30)}%
            </span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id="right" defaultSize={70} minSize={30}>
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
            <span className="text-sm font-semibold">
              {Math.round(sizes.right ?? 70)}%
            </span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
