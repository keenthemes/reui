// Description: Handle pill with spring scale on drag
// Order: 6
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
        <ResizablePanel defaultSize={30}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="text-sm font-semibold">Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle className="before:bg-muted-foreground/20 hover:before:bg-muted-foreground/40 active:before:bg-primary before:pointer-events-none before:absolute before:top-1/2 before:left-1/2 before:z-10 before:h-8 before:w-1 before:-translate-x-1/2 before:-translate-y-1/2 before:scale-y-75 before:rounded-full before:transition-all before:duration-300 before:ease-[cubic-bezier(0.32,0.72,0,1)] hover:before:scale-y-100 active:before:h-14 active:before:w-1.5 active:before:scale-y-100" />
        <ResizablePanel defaultSize={70}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="text-sm font-semibold">Content</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
