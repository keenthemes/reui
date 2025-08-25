'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/registry/default/lib/utils';
import { Button } from '@/registry/default/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/registry/default/ui/command';
import { type DialogProps } from '@radix-ui/react-dialog';
import { File, Search, Undo2 } from 'lucide-react';
import { docsConfig } from '@/config/docs';
import { trackEvent } from '@/lib/analytics';

export function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>('');

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => {
          const newState = !open;
          if (newState) {
            trackEvent({
              name: 'site_header_search_trigger_shortcut',
              properties: {
                method: e.key === '/' ? 'slash' : 'cmd_k',
                category: 'search',
                label: `Search Trigger - ${e.key === '/' ? 'Slash' : 'Cmd+K'}`,
              },
            });
          }
          return newState;
        });
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown, itemTitle?: string) => {
    setOpen(false);
    if (itemTitle) {
      trackEvent({
        name: `site_header_search_${itemTitle.toLowerCase().replace(/\s+/g, '_')}_click`,
        properties: {
          item: itemTitle,
          category: 'search',
          label: `Search Navigation - ${itemTitle}`,
        },
      });
    }
    command();
  }, []);

  const normalizeInput = (input: string) => {
    return input.trim().replace(/\s+/g, ' ');
  };

  const normalizedInput = normalizeInput(inputValue);

  const filteredMainNav = docsConfig.mainNav
    .filter((navitem) => !navitem.external)
    .filter((navItem) => navItem.title.toLowerCase().includes(normalizedInput.toLowerCase()));

  const filteredSidebarNav = docsConfig.sidebarNav.map((group) => ({
    ...group,
    items: group.items?.filter((navItem) => navItem.title?.toLowerCase().includes(normalizedInput.toLowerCase())),
  }));

  return (
    <>
      <Button
        variant="outline"
        mode="input"
        size="sm"
        className={cn('h-8 relative py-0 pl-2 sm:pr-12 sm:w-40 lg:w-48')}
        onClick={() => {
          setOpen(true);
          trackEvent({
            name: 'site_header_search_trigger_click',
            properties: {
              method: 'button_click',
              category: 'search',
              label: 'Search Trigger - Button Click',
            },
          });
        }}
        {...props}
      >
        <Search />
        <span className="hidden lg:inline-flex text-muted-foreground">Search...</span>
        <span className="inline-flex lg:hidden text-muted-foreground">Search...</span>
        <kbd className="pointer-events-none absolute right-[5px] top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          /
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="[&_[data-dialog-close]]:top-[0.925rem] [&_[data-dialog-close]]:end-[0.925rem]"
      >
        <CommandInput placeholder="Type a command or search..." value={inputValue} onValueChange={setInputValue} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {filteredMainNav.length > 0 && (
            <CommandGroup heading="Links">
              {filteredMainNav.map((navItem) => (
                <CommandItem
                  key={navItem.href}
                  value={navItem.title}
                  onSelect={() => {
                    runCommand(() => router.push(navItem.href as string), navItem.title);
                  }}
                >
                  <File className="opacity-80 text-muted-foreground" />
                  {navItem.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {filteredSidebarNav.map((group) =>
            group?.items && group.items.length > 0 ? (
              <CommandGroup key={group.title} heading={group.title}>
                {group.items.map((navItem) => (
                  <CommandItem
                    key={navItem.href}
                    value={navItem.title}
                    onSelect={() => {
                      runCommand(() => router.push(navItem.href as string), navItem.title);
                    }}
                  >
                    <Undo2 className="opacity-80 rotate-180 text-muted-foreground" />
                    {navItem.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null,
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
