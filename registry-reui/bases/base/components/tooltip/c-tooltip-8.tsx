// Description: Toolbar with tooltip actions
// Order: 8

import { Button } from "@/registry/bases/base/ui/button"
import { Separator } from "@/registry/bases/base/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/bases/base/ui/tooltip"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <TooltipProvider>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Bold" />
              }
            >
              <IconPlaceholder
                lucide="BoldIcon"
                tabler="IconBold"
                hugeicons="TextBoldIcon"
                phosphor="TextBIcon"
                remixicon="RiBold"
                aria-hidden="true"
              />
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Italic" />
              }
            >
              <IconPlaceholder
                lucide="ItalicIcon"
                tabler="IconItalic"
                hugeicons="TextItalicIcon"
                phosphor="TextItalicIcon"
                remixicon="RiItalic"
                aria-hidden="true"
              />
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Underline" />
              }
            >
              <IconPlaceholder
                lucide="UnderlineIcon"
                tabler="IconUnderline"
                hugeicons="TextUnderlineIcon"
                phosphor="TextUnderlineIcon"
                remixicon="RiUnderline"
                aria-hidden="true"
              />
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>
          <div className="flex items-center">
            <Separator
              orientation="vertical"
              className="mx-1 h-5 leading-none"
            />
          </div>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Image" />
              }
            >
              <IconPlaceholder
                lucide="ImageIcon"
                tabler="IconPhoto"
                hugeicons="ImageIcon"
                phosphor="ImageIcon"
                remixicon="RiImageLine"
                aria-hidden="true"
              />
            </TooltipTrigger>
            <TooltipContent>Insert Image</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )
}
