import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/registry/bases/radix/ui/context-menu"

export default function Pattern() {
  return (
    <div className="flex w-full items-center justify-center p-12">
      <div className="grid grid-cols-2 gap-2">
        {(["left", "top", "bottom", "right"] as const).map((side) => (
          <ContextMenu key={side}>
            <ContextMenuTrigger className="text-muted-foreground rounded-lg flex aspect-[2/0.5] items-center justify-center border border-dashed p-4 text-sm capitalize">
              {side}
            </ContextMenuTrigger>
            <ContextMenuContent side={side}>
              <ContextMenuGroup>
                <ContextMenuItem>Back</ContextMenuItem>
                <ContextMenuItem>Forward</ContextMenuItem>
                <ContextMenuItem>Reload</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
    </div>
  )
}
