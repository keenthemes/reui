'use client';

import { usePathname } from 'next/navigation';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SiteSubscribe } from '@/components/site-subscribe';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <div vaul-drawer-wrapper="true" className="relative flex min-h-screen flex-col bg-background isolate">
      <div className="border-border/40 dark:border-border">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        {pathname && !pathname.startsWith('/docs') && !pathname.startsWith('/blocks') && <SiteSubscribe />}
        <SiteFooter />
      </div>
    </div>
  );
}
