'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useCopyToClipboard } from '@/registry/default/hooks/use-copy-to-clipboard';
import { cn } from '@/registry/default/lib/utils';
import { Button } from '@/registry/default/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/registry/default/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/registry/default/ui/tooltip';
import { DirectionProvider } from '@radix-ui/react-direction';
import { Check, Copy, LoaderCircleIcon, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  trackCodeCopy,
  trackDirectionChange,
  trackViewChange,
} from '@/lib/analytics';
import { useConfig } from '@/hooks/use-config';

type themeType = 'dark' | 'light' | '';

type ComponentPreviewContext = {
  path: string;
  highlightedCode: string;
  code: string;
  codeHeight?: number;
  codeCollapsed?: boolean;
  view: 'code' | 'preview';
  setView: (view: 'code' | 'preview') => void;
  theme: themeType;
  setTheme: React.Dispatch<React.SetStateAction<themeType>>;
  rtl: boolean;
  setRtl: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
};

export interface ComponentPreviewProps {
  path: string;
  code: string;
  highlightedCode: string;
  codeHeight?: number;
  codeCollapsed?: boolean;
}

const ComponentPreviewContext =
  React.createContext<ComponentPreviewContext | null>(null);

export function useComponentPreview() {
  const context = React.useContext(ComponentPreviewContext);
  if (!context) {
    throw new Error(
      'useComponentPreview must be used within a ComponentPreviewProvider.',
    );
  }
  return context;
}

function ComponentPreviewProvider({
  path,
  code,
  highlightedCode,
  codeHeight,
  children,
}: {
  path: string;
  code: string;
  highlightedCode: string;
  codeHeight?: number;
  children: ReactNode;
}) {
  const [view, setView] = useState<ComponentPreviewContext['view']>('preview');
  const [theme, setTheme] = useState<themeType>('');
  const [rtl, setRtl] = useState(false);

  return (
    <ComponentPreviewContext.Provider
      value={{
        path,
        code,
        highlightedCode,
        codeHeight,
        children,
        view,
        setView,
        theme,
        setTheme,
        rtl,
        setRtl,
      }}
    >
      <div
        data-view={view}
        className="group/block-view-wrapper flex min-w-0 flex-col items-stretch gap-4"
        style={
          {
            '--height': `${codeHeight || ''}px`,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </ComponentPreviewContext.Provider>
  );
}

function ThemeToggleButton() {
  const { resolvedTheme } = useTheme();
  const { theme, setTheme } = useComponentPreview();
  const [activeTheme, setActiveTheme] = useState<string | undefined>(undefined);

  useEffect(() => {
    setActiveTheme(theme === '' ? resolvedTheme : theme);
  }, [theme, resolvedTheme]);

  const toggleTheme = () => {
    const newTheme = activeTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <Button
      mode="icon"
      size="sm"
      variant="outline"
      className=""
      onClick={toggleTheme}
    >
      {activeTheme === 'dark' ? (
        <Sun className="h-3.5 w-3.5" />
      ) : (
        <Moon className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}

function RtlToggleButton() {
  const { path, rtl, setRtl } = useComponentPreview();

  return (
    <Button
      mode="icon"
      size="sm"
      variant="outline"
      className={cn('leading-[0] text-muted-foreground text-[0.6rem]')}
      onClick={() => {
        const newDirection = rtl ? 'ltr' : 'rtl';
        setRtl(!rtl);
        trackDirectionChange(path, newDirection);
      }}
    >
      {rtl ? 'LTR' : 'RTL'}
    </Button>
  );
}

function OpenInV0Button({
  name,
}: { name: string } & React.ComponentProps<typeof Button>) {
  return (
    <Button
      aria-label="Open in v0"
      size="sm"
      variant="outline"
      className="text-muted-foreground hidden"
      asChild
    >
      <a
        href={`https://v0.dev/chat/api/open?url=${process.env.NEXT_PUBLIC_BASE_URL}/r/${name}.json`}
        target="_blank"
        rel="noreferrer"
      >
        Open in{' '}
        <svg
          viewBox="0 0 40 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-4!"
        >
          <path
            d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z"
            fill="currentColor"
          ></path>
          <path
            d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z"
            fill="currentColor"
          ></path>
        </svg>
      </a>
    </Button>
  );
}

function CliCodeButton({
  name,
}: { name: string } & React.ComponentProps<typeof Button>) {
  const { copy, copied } = useCopyToClipboard();
  const [config] = useConfig();
  const packageManager = config.packageManager || 'pnpm';
  const commands = {
    pnpm: `pnpm dlx shadcn@latest add https://reui.io/r/${name}.json`,
    npm: `npx shadcn@latest add https://reui.io/r/${name}.json`,
    yarn: `npx shadcn@latest add https://reui.io/r/${name}.json`,
    bun: `bunx --bun shadcn@latest add https://reui.io/r/${name}.json`,
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="text-muted-foreground w-36 justify-start"
            onClick={() => {
              copy(commands[packageManager]);
            }}
          >
            {copied ? <Check className="text-secondary-foreground" /> : '>_'}
            <span className="truncate">{commands[packageManager]}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{commands[packageManager]}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ComponentPreviewToolbar() {
  const { setView } = useComponentPreview();
  const { path } = useComponentPreview();

  return (
    <div className="flex items-center gap-2.5 justify-between">
      <div className={cn('w-full flex items-center justify-between gap-2')}>
        <Tabs
          defaultValue="preview"
          onValueChange={(value) => {
            setView(value as 'preview' | 'code');
            trackViewChange(path, value as 'preview' | 'code');
          }}
          className="flex"
        >
          <TabsList className="h-[34px] flex items-stretch rounded-md gap-1 px-1 py-1 bg-accent/70">
            <TabsTrigger value="preview" className="rounded-sm text-xs px-2.5">
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="rounded-sm text-xs px-2.5">
              Code
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <CliCodeButton name={path.replaceAll('/', '-')} />
          <OpenInV0Button name={path.replaceAll('/', '-')} />
          <ThemeToggleButton />
          <RtlToggleButton />
          <PreviewCopyCodeButton />
        </div>
      </div>
    </div>
  );
}

function PreviewCopyCodeButton() {
  const { code, path } = useComponentPreview();
  const { copy, copied } = useCopyToClipboard();

  return (
    <Button
      mode="icon"
      size="sm"
      variant="outline"
      onClick={() => {
        copy(code);
        // Track the copy event
        trackCodeCopy(path);
      }}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  );
}

function ComponentPreviewDemo() {
  const { theme, rtl, path, view } = useComponentPreview();
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  // Load the component dynamically
  useEffect(() => {
    const loadComponent = async () => {
      try {
        const ComponentModule = await import(
          `@/registry/default/components/${path}`
        );
        setComponent(() => ComponentModule.default);
      } catch (error) {
        console.error(`Failed to load component at path: ${path}`, error);
      }
    };

    loadComponent();
  }, [path]);

  if (view !== 'preview') return null; // Return null if not in preview mode

  // Always render component skeleton
  return (
    <DirectionProvider dir={rtl ? 'rtl' : 'ltr'}>
      <div
        className={cn(
          'flex lg:min-h-[350px] grow justify-center items-center bg-card overflow-x-auto border border-border/90 rounded-lg p-6 lg:p-10',
          theme === 'dark' && 'dark',
          theme === 'light' && 'light',
        )}
        dir={rtl ? 'rtl' : 'ltr'}
        style={{ direction: rtl ? 'rtl' : 'ltr' }}
      >
        {Component ? (
          <Component />
        ) : (
          <div className="h-full text-xs flex items-center justify-center gap-1.5 text-muted-foreground">
            <LoaderCircleIcon className="size-4 animate-spin" />
            Loading
          </div>
        )}
      </div>
    </DirectionProvider>
  );
}

function ComponentPreviewCode() {
  const { view, highlightedCode } = useComponentPreview();

  if (view !== 'code') return;

  return (
    <div>
      <div
        className={cn(
          'relative overflow-hidden rounded-xl bg-neutral-950 dark:bg-neutral-900 text-white',
        )}
      >
        <div
          data-rehype-pretty-code-fragment
          dangerouslySetInnerHTML={{ __html: highlightedCode || '' }}
          className="
              relative [tab-size:2] flex-1 overflow-hidden after:absolute after:inset-y-0 after:left-0 after:w-10 after:bg-neutral-950 dark:after:bg-neutral-900 [&_.line:before]:sticky [&_.line:before]:left-2 [&_.line:before]:z-10 [&_.line:before]:translate-y-[-1px] [&_.line:before]:pr-1 [&_pre]:max-h-(--height) [&_pre]:overflow-auto [&_pre]:!bg-transparent [&_pre]:pt-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed
            "
        />
      </div>
    </div>
  );
}

export function ComponentPreview({
  path,
  code,
  highlightedCode,
  codeHeight = 800,
}: ComponentPreviewProps) {
  if (!code) {
    return null;
  }

  return (
    <div className="pt-3.5 mb-14">
      <ComponentPreviewProvider
        path={path}
        code={code}
        highlightedCode={highlightedCode}
        codeHeight={codeHeight}
      >
        <ComponentPreviewToolbar />
        <ComponentPreviewDemo />
        <ComponentPreviewCode />
      </ComponentPreviewProvider>
    </div>
  );
}
