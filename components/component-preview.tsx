'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useCopyToClipboard } from '@/registry/default/hooks/use-copy-to-clipboard';
import { cn } from '@/registry/default/lib/utils';
import { Button } from '@/registry/default/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/registry/default/ui/tabs';
import { DirectionProvider } from '@radix-ui/react-direction';
import { Check, Copy, LoaderCircleIcon, Moon, RotateCw, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { trackCodeCopy, trackDirectionChange, trackViewChange } from '@/lib/analytics';
import { CliCodeCopyButton } from './cli-code-copy-button';

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
  reloadKey: number;
  reload: () => void;
  children: ReactNode;
};

export interface ComponentPreviewProps {
  path: string;
  code: string;
  highlightedCode: string;
  codeHeight?: number;
  codeCollapsed?: boolean;
}

const ComponentPreviewContext = React.createContext<ComponentPreviewContext | null>(null);

export function useComponentPreview() {
  const context = React.useContext(ComponentPreviewContext);
  if (!context) {
    throw new Error('useComponentPreview must be used within a ComponentPreviewProvider.');
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
  const [rtl, setRtl] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const reload = () => {
    setReloadKey((prev) => prev + 1);
  };

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
        reloadKey,
        reload,
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    <Button mode="icon" size="sm" variant="outline" className="size-7.5" onClick={toggleTheme}>
      {activeTheme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
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
      className={cn('size-7.5 leading-[0] text-muted-foreground text-[0.6rem]')}
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

function ReloadButton() {
  const { reload } = useComponentPreview();

  return (
    <Button mode="icon" size="sm" variant="outline" className="size-7.5" onClick={reload}>
      <RotateCw className="size-3.5" />
    </Button>
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
          onValueChange={(value: string) => {
            setView(value as 'preview' | 'code');
            trackViewChange(path, value as 'preview' | 'code');
          }}
          className="flex"
        >
          <TabsList className="h-7.5 flex items-stretch rounded-md gap-1 px-1 py-1 bg-accent/70">
            <TabsTrigger value="preview" className="rounded-sm text-xs px-2.5">
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="rounded-sm text-xs px-2.5">
              Code
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <CliCodeCopyButton name={path.replaceAll('/', '-')} />
          <RtlToggleButton />
          <ReloadButton />
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
  const { theme, rtl, path, view, reloadKey } = useComponentPreview();
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  // Load the component dynamically
  useEffect(() => {
    const loadComponent = async () => {
      try {
        // Clear the component first to show loading state
        setComponent(null);

        // Force module reload by adding timestamp to bypass cache
        const ComponentModule = await import(`@/registry/default/components/${path}`);
        setComponent(() => ComponentModule.default);
      } catch (error) {
        console.error(`Failed to load component at path: ${path}`, error);
        // Fallback: try loading without timestamp
        try {
          const ComponentModule = await import(`@/registry/default/components/${path}`);
          setComponent(() => ComponentModule.default);
        } catch (fallbackError) {
          console.error(`Fallback load also failed:`, fallbackError);
        }
      }
    };

    loadComponent();
  }, [path, reloadKey]); // reloadKey dependency will trigger reload

  if (view !== 'preview') return null; // Return null if not in preview mode

  // Always render component skeleton
  return (
    <DirectionProvider dir={rtl ? 'rtl' : 'ltr'}>
      <div
        className={cn(
          'flex lg:min-h-[350px] grow justify-center items-center bg-card border border-border/90 rounded-lg p-6 lg:p-10',
          theme === 'dark' && 'dark',
          theme === 'light' && 'light',
        )}
        dir={rtl ? 'rtl' : 'ltr'}
        style={{ direction: rtl ? 'rtl' : 'ltr' }}
      >
        {Component ? (
          <Component key={reloadKey} />
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
      <div className={cn('relative overflow-hidden rounded-xl bg-neutral-950 dark:bg-neutral-900 text-white')}>
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

export function ComponentPreview({ path, code, highlightedCode, codeHeight = 800 }: ComponentPreviewProps) {
  if (!code) {
    return null;
  }

  return (
    <div className="pt-3.5 mb-14">
      <ComponentPreviewProvider path={path} code={code} highlightedCode={highlightedCode} codeHeight={codeHeight}>
        <ComponentPreviewToolbar />
        <ComponentPreviewDemo />
        <ComponentPreviewCode />
      </ComponentPreviewProvider>
    </div>
  );
}
