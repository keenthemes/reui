// Description: Button-style breadcrumb
// Order: 14

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/bases/base/ui/breadcrumb"
import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="sm:gap-1">
        <BreadcrumbItem>
          <BreadcrumbLink
            render={<Button variant="ghost" size="sm" />}
            href="#"
          >
            <IconPlaceholder
              lucide="HouseIcon"
              tabler="IconHome"
              hugeicons="Home03Icon"
              phosphor="HouseIcon"
              remixicon="RiHome5Line"
            />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>
          <IconPlaceholder
            lucide="ChevronRightIcon"
            tabler="IconChevronRight"
            hugeicons="ArrowRight01Icon"
            phosphor="CaretRightIcon"
            remixicon="RiArrowRightSLine"
          />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbLink
            href="#"
            render={<Button variant="ghost" size="sm" />}
          >
            <IconPlaceholder
              lucide="LayoutGridIcon"
              tabler="IconLayoutGrid"
              hugeicons="GridViewIcon"
              phosphor="SquaresFourIcon"
              remixicon="RiGalleryView2"
            />
            Workspace
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>
          <IconPlaceholder
            lucide="ChevronRightIcon"
            tabler="IconChevronRight"
            hugeicons="ArrowRight01Icon"
            phosphor="CaretRightIcon"
            remixicon="RiArrowRightSLine"
          />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>
            <Button variant="secondary" size="sm">
              <IconPlaceholder
                lucide="SettingsIcon"
                tabler="IconSettings"
                hugeicons="SettingsIcon"
                phosphor="GearIcon"
                remixicon="RiSettings3Line"
              />
              Settings
            </Button>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
