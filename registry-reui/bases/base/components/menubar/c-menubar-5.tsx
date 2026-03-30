// Description: Menubar for formatting and media.
// Order: 5

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/registry/bases/base/ui/menubar"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Format</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <IconPlaceholder
                lucide="BoldIcon"
                tabler="IconBold"
                hugeicons="TextBoldIcon"
                phosphor="TextBIcon"
                remixicon="RiBold"
              />
              Bold <MenubarShortcut>⌘B</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <IconPlaceholder
                lucide="ItalicIcon"
                tabler="IconItalic"
                hugeicons="TextItalicIcon"
                phosphor="TextItalicIcon"
                remixicon="RiItalic"
              />
              Italic <MenubarShortcut>⌘I</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarCheckboxItem checked>Strikethrough</MenubarCheckboxItem>
            <MenubarCheckboxItem>Code</MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Insert</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>
                <IconPlaceholder
                  lucide="ImageIcon"
                  tabler="IconPhoto"
                  hugeicons="ImageIcon"
                  phosphor="ImageIcon"
                  remixicon="RiImageLine"
                />
                Media
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Image</MenubarItem>
                <MenubarItem>Video</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>
              <IconPlaceholder
                lucide="LinkIcon"
                tabler="IconLink"
                hugeicons="Link01Icon"
                phosphor="LinkIcon"
                remixicon="RiLinkM"
              />
              Link <MenubarShortcut>⌘K</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}
