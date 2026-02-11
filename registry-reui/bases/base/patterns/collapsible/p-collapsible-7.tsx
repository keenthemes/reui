// Description: Nested collapsible list with actions
// Order: 7

"use client"

import { useState } from "react"
import { useCopyToClipboard } from "@/registry-reui/bases/base/hooks/use-copy-to-clipboard"
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/registry-reui/bases/base/reui/frame"

import { Button } from "@/registry/bases/base/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/bases/base/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const initialKeys = [
  { id: "1", name: "Production", key: "AUDO230454*242SDIFPPL" },
  { id: "2", name: "Development", key: "DUILO30454*242SDIFUIP" },
  { id: "3", name: "Staging", key: "IPPODAS230454*242SDI" },
]

export default function Pattern() {
  const [keys, setKeys] = useState(initialKeys)

  return (
    <div className="h-54 w-full max-w-xs">
      <Frame stacked dense spacing="sm">
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full">
            <FrameHeader className="flex grow flex-row items-center justify-between gap-1.5 py-1!">
              <IconPlaceholder
                lucide="ChevronRightIcon"
                tabler="IconChevronRight"
                hugeicons="ArrowRight01Icon"
                phosphor="CaretRightIcon"
                remixicon="RiArrowRightSLine"
                aria-hidden="true"
                className="text-muted-foreground size-4 transition-transform in-data-open:rotate-90"
              />
              <FrameTitle className="text-sm font-medium">API Keys</FrameTitle>
              <Button
                variant="ghost"
                size="icon-sm"
                className="hover:border-border ml-auto"
              >
                <IconPlaceholder
                  lucide="PlusIcon"
                  tabler="IconPlus"
                  hugeicons="PlusSignIcon"
                  phosphor="PlusIcon"
                  remixicon="RiAddLine"
                  aria-hidden="true"
                />
              </Button>
            </FrameHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <FramePanel>
              <div className="flex flex-col gap-2.5">
                {keys.map((item) => (
                  <ApiKeyItem
                    key={item.id}
                    item={item}
                    onDelete={(id) =>
                      setKeys((k) => k.filter((i) => i.id !== id))
                    }
                  />
                ))}
              </div>
            </FramePanel>
          </CollapsibleContent>
        </Collapsible>
      </Frame>
    </div>
  )
}

function ApiKeyItem({
  item,
  onDelete,
}: {
  item: (typeof initialKeys)[0]
  onDelete: (id: string) => void
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <div className="flex items-center justify-between gap-3.5">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="bg-muted border-border/60 flex size-5.5 shrink-0 items-center justify-center rounded-sm border-2">
            <IconPlaceholder
              lucide="LockIcon"
              tabler="IconLock"
              hugeicons="SquareLock01Icon"
              phosphor="LockSimpleIcon"
              remixicon="RiLockLine"
              aria-hidden="true"
              className="size-3.25 text-emerald-600"
            />
          </div>
          <div className="w-10 truncate text-xs">{item.name}</div>
        </div>
        <div className="bg-muted w-40 truncate rounded-md px-2 py-1 text-xs">
          {item.key}
        </div>
      </div>
      <div className="flex shrink-0 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-xs">
                <IconPlaceholder
                  lucide="MoreHorizontalIcon"
                  tabler="IconDots"
                  hugeicons="MoreHorizontalCircle01Icon"
                  phosphor="DotsThreeIcon"
                  remixicon="RiMoreLine"
                  aria-hidden="true"
                />
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="min-w-32">
            <DropdownMenuItem onClick={() => copyToClipboard(item.key)}>
              {isCopied ? (
                <IconPlaceholder
                  lucide="CheckIcon"
                  tabler="IconCheck"
                  hugeicons="Tick02Icon"
                  phosphor="CheckIcon"
                  remixicon="RiCheckLine"
                  aria-hidden="true"
                  className="text-green-500"
                />
              ) : (
                <IconPlaceholder
                  lucide="CopyIcon"
                  tabler="IconCopy"
                  hugeicons="CopyIcon"
                  phosphor="CopyIcon"
                  remixicon="RiFileCopyLine"
                  aria-hidden="true"
                />
              )}
              <span>{isCopied ? "Copied" : "Copy key"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(item.id)}
            >
              <IconPlaceholder
                lucide="TrashIcon"
                tabler="IconTrash"
                hugeicons="DeleteIcon"
                phosphor="TrashIcon"
                remixicon="RiDeleteBinLine"
                aria-hidden="true"
              />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
