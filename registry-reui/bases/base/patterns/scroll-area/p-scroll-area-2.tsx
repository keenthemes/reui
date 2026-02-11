// Description: Scroll area with horizontal scrollbar
// Order: 2

import { ScrollArea, ScrollBar } from "@/registry/bases/base/ui/scroll-area"

export default function Pattern() {
  return (
    <ScrollArea className="style-vega:rounded-lg style-lyra:rounded-none style-maia:rounded-2xl style-nova:rounded-2xl style-mira:rounded-md h-auto max-w-96 border">
      <div className="flex w-max gap-4 p-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="style-vega:rounded-lg style-lyra:rounded-none style-maia:rounded-2xl style-nova:rounded-2xl style-mira:rounded-md relative h-36 w-40 shrink-0 overflow-hidden border"
          >
            <img
              src={`https://picsum.photos/400/300?random=${i + 1}`}
              alt={`Image ${i + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
