// Description: Publish controls with split button and overflow
// Order: 53

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/registry/bases/radix/ui/avatar"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/registry/bases/radix/ui/button-group"
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

const viewers = [
  {
    src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    initials: "SC",
    name: "Sarah Chen",
  },
  {
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    initials: "AJ",
    name: "Alex Johnson",
  },
]

export default function Pattern() {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <AvatarGroup>
        {viewers.map((viewer) => (
          <Avatar key={viewer.name} size="sm">
            <AvatarImage src={viewer.src} alt={viewer.name} />
            <AvatarFallback>{viewer.initials}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>

      <Separator orientation="vertical" className="my-auto h-4" />

      <Button variant="outline" size="sm">
        <IconPlaceholder
          lucide="EyeIcon"
          tabler="IconEye"
          hugeicons="EyeIcon"
          phosphor="EyeIcon"
          remixicon="RiEyeLine"
          aria-hidden="true"
        />
        <span className="hidden md:block">Preview</span>
      </Button>

      <ButtonGroup className="**:data-[slot=button]:border-r-0">
        <Button size="sm">
          <IconPlaceholder
            lucide="SendIcon"
            tabler="IconSend"
            hugeicons="Sent01Icon"
            phosphor="PaperPlaneRightIcon"
            remixicon="RiSendPlaneLine"
            aria-hidden="true"
          />
          Publish
        </Button>

        <ButtonGroupSeparator className="bg-primary/72" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon-sm"
              className="border-primary-foreground/20 rounded-l-none border-l"
              aria-label="More publish options"
            >
              <IconPlaceholder
                lucide="ChevronDownIcon"
                tabler="IconChevronDown"
                hugeicons="ArrowDown01Icon"
                phosphor="CaretDownIcon"
                remixicon="RiArrowDownSLine"
                aria-hidden="true"
              />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent sideOffset={8} align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="CalendarIcon"
                  tabler="IconCalendar"
                  hugeicons="Calendar01Icon"
                  phosphor="CalendarIcon"
                  remixicon="RiCalendarLine"
                  className="size-4 opacity-60"
                  aria-hidden="true"
                />
                Schedule for later
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="FileIcon"
                  tabler="IconFile"
                  hugeicons="FileEmpty02Icon"
                  phosphor="FileIcon"
                  remixicon="RiFileLine"
                  className="size-4 opacity-60"
                  aria-hidden="true"
                />
                Save as draft
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="More actions">
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

        <DropdownMenuContent sideOffset={8} align="end" className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="CopyIcon"
                tabler="IconCopy"
                hugeicons="CopyIcon"
                phosphor="CopyIcon"
                remixicon="RiFileCopyLine"
                className="size-4 opacity-60"
                aria-hidden="true"
              />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="HistoryIcon"
                tabler="IconHistory"
                hugeicons="Clock01Icon"
                phosphor="ClockCounterClockwiseIcon"
                remixicon="RiHistoryLine"
                className="size-4 opacity-60"
                aria-hidden="true"
              />
              View history
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="ArchiveIcon"
                tabler="IconArchive"
                hugeicons="Archive01Icon"
                phosphor="ArchiveIcon"
                remixicon="RiArchiveLine"
                className="size-4 opacity-60"
                aria-hidden="true"
              />
              Archive
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <IconPlaceholder
                lucide="TrashIcon"
                tabler="IconTrash"
                hugeicons="Delete01Icon"
                phosphor="TrashIcon"
                remixicon="RiDeleteBinLine"
                aria-hidden="true"
              />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
