// Description: Share and export dropdown menu
// Order: 13

import { Button } from "@/registry/bases/base/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className="w-fit gap-2">
              <IconPlaceholder
                lucide="Share2Icon"
                tabler="IconShare"
                hugeicons="Share08Icon"
                phosphor="ShareNetworkIcon"
                remixicon="RiStackshareLine"
                aria-hidden="true"
              />
              Share
            </Button>
          }
        />
        <DropdownMenuContent className="w-48" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Share via</DropdownMenuLabel>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="MailIcon"
                tabler="IconMail"
                hugeicons="MailIcon"
                phosphor="EnvelopeIcon"
                remixicon="RiMailLine"
                aria-hidden="true"
              />
              Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="MessageCircleIcon"
                tabler="IconMessageCircle"
                hugeicons="Message02Icon"
                phosphor="ChatCircleIcon"
                remixicon="RiChat3Line"
                aria-hidden="true"
              />
              Message
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="LinkIcon"
                tabler="IconLink"
                hugeicons="Link01Icon"
                phosphor="LinkIcon"
                remixicon="RiLinkM"
                aria-hidden="true"
              />
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Export as</DropdownMenuLabel>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="FileTextIcon"
                tabler="IconFileText"
                hugeicons="File02Icon"
                phosphor="FileTextIcon"
                remixicon="RiFileTextLine"
                aria-hidden="true"
              />
              PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="FileSpreadsheetIcon"
                tabler="IconFileSpreadsheet"
                hugeicons="GoogleSheetIcon"
                phosphor="FileTextIcon"
                remixicon="RiFileTextLine"
                aria-hidden="true"
              />
              CSV
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="ImageIcon"
                tabler="IconPhoto"
                hugeicons="ImageIcon"
                phosphor="ImageIcon"
                remixicon="RiImageLine"
                aria-hidden="true"
              />
              PNG
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="PrinterIcon"
              tabler="IconPrinter"
              hugeicons="PrinterIcon"
              phosphor="PrinterIcon"
              remixicon="RiPrinterLine"
              aria-hidden="true"
            />
            Print
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
