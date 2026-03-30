// Description: File upload list with progress & status.
// Order: 5

"use client"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/base/ui/item"
import { Progress } from "@/registry/bases/base/ui/progress"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const files = [
  { id: "1", name: "document.pdf", progress: 45, status: "2m 30s" },
  { id: "2", name: "presentation.pptx", progress: 78, status: "45s" },
  { id: "3", name: "spreadsheet.xlsx", progress: 12, status: "5m 12s" },
  { id: "4", name: "image.jpg", progress: 100, status: "Complete" },
]

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-xs flex-col">
      <ItemGroup>
        {files.map((file) => (
          <Item key={file.id} size="xs" className="px-0">
            <ItemMedia variant="icon">
              <IconPlaceholder
                lucide="FileIcon"
                tabler="IconFile"
                hugeicons="FileEmpty02Icon"
                phosphor="FileIcon"
                remixicon="RiFileLine"
                className="text-muted-foreground size-4"
              />
            </ItemMedia>
            <ItemContent className="flex-1 truncate">
              <ItemTitle className="cursor-pointer truncate hover:underline">
                {file.name}
              </ItemTitle>
            </ItemContent>
            <ItemContent className="w-32">
              <Progress
                value={file.progress}
                className="**:data-[slot=progress-track]:h-1"
              />
            </ItemContent>
            <ItemActions className="w-20 justify-end">
              <span className="text-foreground">{file.status}</span>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </div>
  )
}
