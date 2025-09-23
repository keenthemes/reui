import { ToastProvider } from '@/registry/default/ui/base-toast';
import { ScrollArea } from '@/registry/default/ui/scroll-area';
import { sitemapConfig } from '@/config/sitemap';
import { DocsSidebarNavAccordion } from '@/components/sidebar-nav-accordion';

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-4 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="border-border dark:border-border fixed top-[66px] z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r md:sticky md:block">
        <ScrollArea className="h-[calc(100vh-3.5rem)] overflow-auto py-6 mr-0.5 pr-5 lg:py-6">
          <DocsSidebarNavAccordion config={sitemapConfig} />
        </ScrollArea>
      </aside>

      <ToastProvider>{children}</ToastProvider>
    </div>
  );
}
