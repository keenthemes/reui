// Description: Breadcrumb starting with home icon item
// Order: 12

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/bases/radix/ui/breadcrumb"
import { Button } from "@/registry/bases/radix/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Button size="icon" variant="outline">
              <IconPlaceholder
                lucide="HouseIcon"
                tabler="IconHome"
                hugeicons="Home03Icon"
                phosphor="HouseIcon"
                remixicon="RiHome5Line"
                className="size-4"
              />
              <span className="sr-only">Home</span>
            </Button>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Help Center</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Getting Started</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
