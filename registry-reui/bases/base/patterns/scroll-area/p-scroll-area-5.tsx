// Description: Scroll area with scrollbar gutter
// Order: 5

import { ScrollArea } from "@/registry/bases/base/ui/scroll-area"

export default function Pattern() {
  return (
    <ScrollArea className="style-vega:rounded-lg style-lyra:rounded-none style-maia:rounded-2xl style-nova:rounded-2xl style-mira:rounded-md h-72 w-56 border data-has-overflow-x:py-2.5 data-has-overflow-y:px-2.5">
      <div className="flex w-full flex-col items-center gap-4 py-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="style-vega:rounded-lg style-lyra:rounded-none style-maia:rounded-2xl style-nova:rounded-2xl style-mira:rounded-md relative h-36 w-full shrink-0 overflow-hidden border"
          >
            <img
              src={`https://picsum.photos/400/300?random=${i + 1}`}
              alt={`Image ${i + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
