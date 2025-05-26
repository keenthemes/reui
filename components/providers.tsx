'use client';

import * as React from 'react';
import { TooltipProvider } from '@/registry/default/ui/tooltip';
import { Provider as JotaiProvider } from 'jotai';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <JotaiProvider>
      <NextThemesProvider {...props}>
        <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
      </NextThemesProvider>
    </JotaiProvider>
  );
}
