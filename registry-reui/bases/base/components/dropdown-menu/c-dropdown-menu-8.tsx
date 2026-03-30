// Description: Advance dropdown menu
// Order: 8

"use client"

import { useState } from "react"

import { Button } from "@/registry/bases/base/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  })
  const [theme, setTheme] = useState("light")

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" className="w-fit" />}
        >
          Complex Menu
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>File</DropdownMenuLabel>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="FileIcon"
                tabler="IconFile"
                hugeicons="FileEmpty02Icon"
                phosphor="FileIcon"
                remixicon="RiFileLine"
              />
              New File
              <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <IconPlaceholder
                  lucide="FolderOpenIcon"
                  tabler="IconFolderOpen"
                  hugeicons="FolderOpenIcon"
                  phosphor="FolderOpenIcon"
                  remixicon="RiFolderOpenLine"
                />
                Open Recent
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Project Alpha</DropdownMenuItem>
                  <DropdownMenuItem>Project Beta</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Browse…</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <IconPlaceholder
                  lucide="PaletteIcon"
                  tabler="IconPalette"
                  hugeicons="PaintBoardIcon"
                  phosphor="PaletteIcon"
                  remixicon="RiPaletteLine"
                />
                Theme
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={setTheme}
                  >
                    <DropdownMenuRadioItem value="light">
                      Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      System
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuCheckboxItem
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, email: checked }))
              }
            >
              <IconPlaceholder
                lucide="MailIcon"
                tabler="IconMail"
                hugeicons="MailIcon"
                phosphor="EnvelopeIcon"
                remixicon="RiMailLine"
              />
              Email Notifications
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <IconPlaceholder
              lucide="TrashIcon"
              tabler="IconTrash"
              hugeicons="DeleteIcon"
              phosphor="TrashIcon"
              remixicon="RiDeleteBinLine"
            />
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
