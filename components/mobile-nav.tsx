'use client';

import * as React from 'react';
import Image from 'next/image';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/registry/default/lib/utils';
import { Button } from '@/registry/default/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/registry/default/ui/drawer';
import { Menu } from 'lucide-react';
import { docsConfig } from '@/config/docs';
import { siteConfig } from '@/config/site';
import { useMetaColor } from '@/hooks/use-meta-color';

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const { setMetaColor, metaColor } = useMetaColor();

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      setOpen(open);
      setMetaColor(open ? '#09090b' : metaColor);
    },
    [setMetaColor, metaColor],
  );

  return (
    <div className="flex md:hidden items-center gap-1.5">
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          <Button variant="ghost" className="size-8 p-0 -ms-1.5">
            <Menu className="size-4" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[60svh] p-0">
          <div className="overflow-auto p-6">
            <div className="flex flex-col space-y-3">
              {docsConfig.mainNav?.map(
                (item) =>
                  item.href && (
                    <MobileLink
                      key={item.href}
                      href={item.href}
                      onOpenChange={setOpen}
                    >
                      {item.title}
                    </MobileLink>
                  ),
              )}
            </div>
            <div className="flex flex-col space-y-2">
              {docsConfig.sidebarNav.map((item, index) => (
                <div key={index} className="flex flex-col space-y-3 pt-6">
                  <h4 className="font-medium">{item.title}</h4>
                  {item?.items?.length &&
                    item.items.map((item) => (
                      <React.Fragment key={item.href}>
                        {!item.disabled &&
                          (item.href ? (
                            <MobileLink
                              href={item.href}
                              onOpenChange={setOpen}
                              className="text-muted-foreground"
                            >
                              {item.title}
                              {item.label && (
                                <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                                  {item.label}
                                </span>
                              )}
                            </MobileLink>
                          ) : (
                            item.title
                          ))}
                      </React.Fragment>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/brand/logo-icon-light.svg"
          alt={siteConfig.name}
          width={30}
          height={30}
          className="dark:hidden"
        />
        <Image
          src="/brand/logo-icon-dark.svg"
          alt={siteConfig.name}
          width={30}
          height={30}
          className="hidden dark:inline-block"
        />
      </Link>
    </div>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn('text-base', className)}
      {...props}
    >
      {children}
    </Link>
  );
}
