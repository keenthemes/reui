// Description: Basic scroll area
// Order: 1

import { ScrollArea } from "@/registry/bases/base/ui/scroll-area"

const tags = Array.from({ length: 30 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export default function Pattern() {
  return (
    <ScrollArea className="style-vega:rounded-lg style-lyra:rounded-none style-maia:rounded-2xl style-nova:rounded-2xl style-mira:rounded-md h-72 w-48 border">
      <div className="p-4">
        <h4 className="mb-4 text-sm leading-none font-medium">Releases</h4>
        <div className="flex flex-col divide-y">
          {tags.map((tag, i) => (
            <div key={tag} className="py-2 text-sm">
              {tag}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
