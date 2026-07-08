import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSiteShell } from "@/components/app-site-shell"
import { DocsDesignSystemSync } from "@/components/docs-design-system-sync"
import { getDocsPageTree } from "@/components/docs-page-tree"
import { DocsSidebar } from "@/components/docs-sidebar"

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppSiteShell>
      <DocsDesignSystemSync>
        <div className="container-wrapper flex flex-1 flex-col px-2">
          <SidebarProvider className="3xl:fixed:container 3xl:fixed:px-3 min-h-min flex-1 items-start px-0 [--sidebar-width:220px] [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--sidebar-width:240px] lg:[--top-spacing:--spacing(4)]">
            <DocsSidebar tree={getDocsPageTree()} />
            <div className="h-full w-full">{children}</div>
          </SidebarProvider>
        </div>
      </DocsDesignSystemSync>
    </AppSiteShell>
  )
}
