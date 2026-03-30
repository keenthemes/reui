// Description: File items with icon media, size, and actions
// Order: 6

import { Badge } from "@/registry-reui/bases/base/reui/badge"

import { Button } from "@/registry/bases/base/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/base/ui/item"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-2">
      <Item variant="outline" size="xs">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="FileTextIcon"
            tabler="IconFileText"
            hugeicons="File02Icon"
            phosphor="FileTextIcon"
            remixicon="RiFileTextLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Quarterly Report.pdf</ItemTitle>
          <ItemDescription>2.4 MB &middot; Updated 2 hours ago</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="success-light" size="sm">
            Final
          </Badge>
          <Button variant="outline" size="sm" className="ml-2">
            Open
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="xs">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="FileSpreadsheetIcon"
            tabler="IconFileSpreadsheet"
            hugeicons="GoogleSheetIcon"
            phosphor="FileTextIcon"
            remixicon="RiFileTextLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Budget 2025.xlsx</ItemTitle>
          <ItemDescription>856 KB &middot; Updated yesterday</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="warning-light" size="sm">
            Draft
          </Badge>
          <Button variant="outline" size="sm" className="ml-2">
            Open
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="xs">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="ImageIcon"
            tabler="IconPhoto"
            hugeicons="ImageIcon"
            phosphor="ImageIcon"
            remixicon="RiImageLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Hero Banner.png</ItemTitle>
          <ItemDescription>4.1 MB &middot; Updated 3 days ago</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="info-light" size="sm">
            Review
          </Badge>
          <Button variant="outline" size="sm" className="ml-2">
            Open
          </Button>
        </ItemActions>
      </Item>
    </div>
  )
}
