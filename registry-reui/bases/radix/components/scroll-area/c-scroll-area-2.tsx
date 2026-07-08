import { ScrollArea, ScrollBar } from "@/registry/bases/radix/ui/scroll-area"

export default function Pattern() {
  return (
    <ScrollArea className="rounded-2xl h-auto max-w-96 border">
      <div className="flex w-max gap-4 p-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl relative h-36 w-40 shrink-0 overflow-hidden border"
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
