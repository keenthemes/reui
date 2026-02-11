// Description: Breadcrumb with project, user and document info
// Order: 15

import { Frame, FramePanel } from "@/registry-reui/bases/base/reui/frame"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/bases/base/ui/breadcrumb"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Frame spacing="sm">
      <FramePanel>
        <Breadcrumb>
          <BreadcrumbList className="gap-3">
            <BreadcrumbItem>
              <BreadcrumbLink
                href="#"
                className="text-foreground flex items-center gap-2"
              >
                <Avatar className="size-6">
                  <AvatarImage src="https://github.com/vercel.png" />
                  <AvatarFallback>VC</AvatarFallback>
                </Avatar>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="text-muted-foreground/60">
              /
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-3">
                <Avatar className="size-6">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    className="object-cover"
                  />
                  <AvatarFallback>MP</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-foreground leading-tight font-medium">
                    shadcn
                  </span>
                  <span className="text-muted-foreground leading-tight">
                    ui@shadcn.com
                  </span>
                </div>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="text-muted-foreground/60">
              /
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-2.5">
                <span className="flex size-6 items-center justify-center rounded-md bg-sky-100 text-sky-500 dark:bg-sky-500/10 dark:text-sky-400">
                  <IconPlaceholder
                    lucide="FileTextIcon"
                    tabler="IconFileText"
                    hugeicons="File02Icon"
                    phosphor="FileTextIcon"
                    remixicon="RiFileTextLine"
                    className="size-3.5"
                  />
                </span>
                <div className="flex flex-col">
                  <span className="text-foreground leading-tight font-medium">
                    Document
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1 leading-tight">
                    agents.md
                  </span>
                </div>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </FramePanel>
    </Frame>
  )
}
