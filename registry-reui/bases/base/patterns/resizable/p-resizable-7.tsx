// Description: Handle with large capsule expansion on drag
// Order: 7
// GridSize: 1

"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/bases/base/ui/resizable"

export default function Pattern() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <ResizablePanelGroup
        orientation="horizontal"
        className="style-vega:rounded-lg style-lyra:rounded-none style-maia:rounded-2xl style-nova:rounded-2xl style-mira:rounded-md min-h-[200px] border"
      >
        <ResizablePanel defaultSize={35}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="text-sm font-semibold">Panel A</span>
          </div>
        </ResizablePanel>
        <ResizableHandle className="active:bg-primary/20 before:bg-muted-foreground/20 hover:before:bg-muted-foreground/40 active:before:bg-primary transition-colors duration-200 before:pointer-events-none before:absolute before:top-1/2 before:left-1/2 before:z-10 before:h-6 before:w-1 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:transition-all before:duration-300 before:ease-[cubic-bezier(0.32,0.72,0,1)] hover:before:h-10 hover:before:w-1.5 active:before:h-20 active:before:w-1.5" />
        <ResizablePanel defaultSize={65}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="text-sm font-semibold">Panel B</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
