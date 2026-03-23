"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { getDocsPageUpdateHint } from "@/lib/docs"
import { showMcpDocs } from "@/lib/flags"
import { getCurrentBase, getPagesFromFolder } from "@/lib/page-tree"
import type { source } from "@/lib/source"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const EXCLUDED_SECTIONS = ["test"]
const EXCLUDED_PAGES = ["test"]

function DocsUpdateIndicator({ path }: { path: string }) {
  const hint = getDocsPageUpdateHint(path)

  if (!hint) {
    return null
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex shrink-0 cursor-help">
          <span className="sr-only">{hint}</span>
          <span
            aria-hidden="true"
            className="site-rounded-full flex size-2 bg-blue-500"
          />
        </span>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {hint}
      </TooltipContent>
    </Tooltip>
  )
}

export function DocsSidebar({
  tree,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  tree: ReturnType<typeof source.getPageTree>
}) {
  const pathname = usePathname()
  const currentBase = getCurrentBase(pathname)

  return (
    <Sidebar
      className="docs-sidebar sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--footer-height)+2rem)] bg-transparent lg:flex"
      collapsible="none"
      {...props}
    >
      <SidebarContent className="no-scrollbar overflow-x-hidden px-2 pb-12">
        <div className="h-(--top-spacing) shrink-0" />
        {tree.children.map((item) => {
          if (EXCLUDED_SECTIONS.includes(item.$id ?? "")) {
            return null
          }

          return (
            <SidebarGroup key={item.$id}>
              <SidebarGroupLabel className="text-site-muted-foreground font-medium">
                {item.name}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {item.type === "folder" && (
                  <SidebarMenu className="gap-0.5">
                    {getPagesFromFolder(item, currentBase).map((page) => {
                      if (!showMcpDocs && page.url.includes("/mcp")) {
                        return null
                      }

                      if (EXCLUDED_PAGES.includes(page.url)) {
                        return null
                      }

                      return (
                        <SidebarMenuItem key={page.url}>
                          <SidebarMenuButton
                            asChild
                            isActive={page.url === pathname}
                            className="data-[active=true]:bg-site-accent data-[active=true]:border-site-accent 3xl:fixed:w-full 3xl:fixed:max-w-48 after:site-rounded-md relative h-[30px] w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0"
                          >
                            <Link href={page.url} prefetch={false}>
                              <span className="pointer-events-none absolute inset-0 flex w-(--sidebar-width) bg-transparent" />
                              <span className="relative z-10 inline-flex items-center gap-2">
                                <span>{page.name}</span>
                                <DocsUpdateIndicator path={page.url} />
                              </span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>
    </Sidebar>
  )
}
