// Description: Stat card with trend and overflow menu
// Order: 15

import { Badge } from "@/registry-reui/bases/radix/reui/badge"

import { Button } from "@/registry/bases/radix/ui/button"
import { Card, CardContent } from "@/registry/bases/radix/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import { Separator } from "@/registry/bases/radix/ui/separator"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const title = "Revenue"
  const value = "$12.4k"
  const delta = 12.5
  const positive = true
  const lastMonth = "$11.0k"

  return (
    <Card className="w-full max-w-xs">
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-me-1.5"
                aria-label="More options"
              >
                <IconPlaceholder
                  lucide="MoreHorizontalIcon"
                  tabler="IconDots"
                  hugeicons="MoreHorizontalCircle01Icon"
                  phosphor="DotsThreeIcon"
                  remixicon="RiMoreLine"
                  aria-hidden="true"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="SettingsIcon"
                    tabler="IconSettings"
                    hugeicons="Settings01Icon"
                    phosphor="GearIcon"
                    remixicon="RiSettings3Line"
                    aria-hidden="true"
                  />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="TriangleAlertIcon"
                    tabler="IconAlertTriangle"
                    hugeicons="Alert02Icon"
                    phosphor="WarningIcon"
                    remixicon="RiErrorWarningLine"
                    aria-hidden="true"
                  />
                  Add Alert
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="PinIcon"
                    tabler="IconPin"
                    hugeicons="Pin02Icon"
                    phosphor="PushPinIcon"
                    remixicon="RiPushpinLine"
                    aria-hidden="true"
                  />
                  Pin to Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder
                    lucide="Share2Icon"
                    tabler="IconShare"
                    hugeicons="Share08Icon"
                    phosphor="ShareNetworkIcon"
                    remixicon="RiStackshareLine"
                    aria-hidden="true"
                  />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <IconPlaceholder
                    lucide="TrashIcon"
                    tabler="IconTrash"
                    hugeicons="DeleteIcon"
                    phosphor="TrashIcon"
                    remixicon="RiDeleteBinLine"
                    aria-hidden="true"
                  />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <span className="text-foreground text-2xl font-medium tracking-tight tabular-nums">
              {value}
            </span>
            <Badge variant={positive ? "success-light" : "destructive-light"}>
              {positive ? (
                <IconPlaceholder
                  lucide="ArrowUpIcon"
                  tabler="IconArrowUp"
                  hugeicons="ArrowUp02Icon"
                  phosphor="ArrowUpIcon"
                  remixicon="RiArrowUpLine"
                  aria-hidden="true"
                />
              ) : (
                <IconPlaceholder
                  lucide="ArrowDownIcon"
                  tabler="IconArrowDown"
                  hugeicons="ArrowDown02Icon"
                  phosphor="ArrowDownIcon"
                  remixicon="RiArrowDownLine"
                  aria-hidden="true"
                />
              )}
              {delta}%
            </Badge>
          </div>
          <Separator />
          <div className="text-muted-foreground text-xs">
            Vs last month:{" "}
            <span className="text-foreground font-medium tabular-nums">
              {lastMonth}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
