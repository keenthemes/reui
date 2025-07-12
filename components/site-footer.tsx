import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Separator } from '@/registry/default/ui/separator';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export function SiteFooter() {
  const pathname = usePathname();

  const handleLinkClick = (linkName: string) => {
    trackEvent({
      name: `site_footer_${linkName}_link_click`,
      properties: {
        category: 'navigation',
        label: `Footer ${linkName} Click`,
        destination: linkName === 'keenthemes' ? 'https://keenthemes.com' : '/privacy-policy',
      },
    });
  };

  return (
    <footer className="border-t border-border py-5 md:py-0">
      <div
        className={cn(
          'flex flex-col items-center justify-between gap-4 md:h-16 py-4 md:flex-row',
          pathname.includes('blocks') ? 'container-fluid' : 'container',
        )}
      >
        <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy;
          {new Date().getFullYear()} ReUI. All rights reserved.
        </div>

        <div className="flex items-center gap-2.5 text-balance text-sm leading-loose">
          <div className="inline-flex gap-1 items-center">
            <span className="text-muted-foreground">A project by</span>{' '}
            <Link
              className="font-medium text-foreground hover:underline hover:underline-offset-2"
              href="https://keenthemes.com"
              target="_blank"
              onClick={() => handleLinkClick('keenthemes')}
            >
              Keenthemes
            </Link>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <Link
            className="font-medium text-foreground hover:underline hover:underline-offset-2"
            href="https://keenthemes.studio"
            target="_blank"
            onClick={() => handleLinkClick('hireus')}
          >
            Hire Us
          </Link>
        </div>
      </div>
    </footer>
  );
}
