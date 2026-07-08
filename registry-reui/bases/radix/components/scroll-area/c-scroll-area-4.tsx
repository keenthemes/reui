import { cn } from "@/registry/bases/radix/lib/utils"
import { ScrollArea } from "@/registry/bases/radix/ui/scroll-area"

export default function Pattern() {
  return (
    <ScrollArea
      className={cn(
        "rounded-2xl h-72 w-48 border",
        "**:data-[slot=scroll-area-thumb]:bg-foreground/15 **:data-[slot=scroll-area-thumb]:rounded-full",
        "**:data-[slot=scroll-area-viewport]:mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))]",
        "**:data-[slot=scroll-area-viewport]:mask-r-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-end)))]",
        "**:data-[slot=scroll-area-viewport]:mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))]",
        "**:data-[slot=scroll-area-viewport]:mask-l-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-start)))]",
        "**:data-[slot=scroll-area-viewport]:[--fade-size:1.5rem]"
      )}
    >
      <div className="flex w-max flex-col gap-4 p-4">
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
    </ScrollArea>
  )
}
