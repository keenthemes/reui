'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useCopyToClipboard } from '@/registry/default/hooks/use-copy-to-clipboard';
import { cn } from '@/registry/default/lib/utils';
import { Button } from '@/registry/default/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/registry/default/ui/resizable';
import { Separator } from '@/registry/default/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/registry/default/ui/tabs';
import {
  ArrowUpRight,
  Check,
  Copy,
  File,
  LoaderCircleIcon,
  Monitor,
  Moon,
  RefreshCcw,
  Smartphone,
  Sun,
  Tablet,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { BlockItem } from '@/config/types';
import { trackBlockCodeCopy, trackEvent } from '@/lib/analytics';
import { toAbsoluteUrl } from '@/lib/helpers';
import { CliCodeCopyButton } from './cli-code-copy-button';
import { OpenInV0Button } from './open-in-v0-button';

type ThemeType = 'dark' | 'light' | '';

type ResponsiveMode = 'desktop' | 'tablet' | 'mobile';

type PreviewPanelContext = {
  block: BlockItem;
  view: 'code' | 'preview';
  setView: (view: 'code' | 'preview') => void;
  resizablePanelRef: React.RefObject<ImperativePanelHandle | null>;
  theme: ThemeType;
  setTheme: React.Dispatch<React.SetStateAction<ThemeType>>;
  rtl: boolean;
  setRtl: React.Dispatch<React.SetStateAction<boolean>>;
  reloadKey: number;
  reloadPreview: () => void;
  responsiveMode: ResponsiveMode;
  setResponsiveMode: React.Dispatch<React.SetStateAction<ResponsiveMode>>;
  panelWidth: number;
  setPanelWidth: React.Dispatch<React.SetStateAction<number>>;
};

const PreviewPanelContext = React.createContext<PreviewPanelContext | null>(null);

function usePreviewPanel() {
  const context = React.useContext(PreviewPanelContext);
  if (!context) {
    throw new Error('usePreviewPanel must be used within a PreviewPanelProvider.');
  }
  return context;
}

function PreviewPanelProvider({ block, children }: { block: BlockItem; children: React.ReactNode }) {
  const [view, setView] = useState<PreviewPanelContext['view']>('preview');
  const resizablePanelRef = useRef<ImperativePanelHandle | null>(null);

  const [theme, setTheme] = useState<ThemeType>('');
  const [rtl, setRtl] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [responsiveMode, setResponsiveMode] = useState<ResponsiveMode>('desktop');
  const [panelWidth, setPanelWidth] = useState<number>(1024);

  const reloadPreview = () => {
    setReloadKey((prev) => prev + 1);
  };

  // Auto-detect responsive mode based on panel width
  useEffect(() => {
    if (panelWidth >= 1024) {
      setResponsiveMode('desktop');
    } else if (panelWidth >= 768) {
      setResponsiveMode('tablet');
    } else {
      setResponsiveMode('mobile');
    }
  }, [panelWidth]);

  return (
    <PreviewPanelContext.Provider
      value={{
        block,
        view,
        setView,
        resizablePanelRef,
        theme,
        setTheme,
        rtl,
        setRtl,
        reloadKey,
        reloadPreview,
        responsiveMode,
        setResponsiveMode,
        panelWidth,
        setPanelWidth,
      }}
    >
      <div data-view={view} className="flex min-w-0 flex-col items-stretch w-full">
        {children}
      </div>
    </PreviewPanelContext.Provider>
  );
}

function PreviewPanelToolbar() {
  const { block } = usePreviewPanel();
  return (
    <div className="flex items-center gap-2.5 justify-between mb-3">
      <div className="flex items-center grow gap-2">
        <PreviewPanelToolbarTabs />
      </div>
      <div className={cn('flex items-center justify-between gap-1.5')}>
        <PreviewPanelResponsive />
        <Separator orientation="vertical" className="mx-2 hidden h-5 xl:flex" />
        {block.name && <CliCodeCopyButton name={block.name} />}
        <Separator orientation="vertical" className="mx-2 hidden h-5 lg:flex" />
        <PreviewPanelToolbarButtons />
      </div>
    </div>
  );
}

function PreviewPanelResponsive() {
  const { responsiveMode, setResponsiveMode, resizablePanelRef, block } = usePreviewPanel();

  const handleResponsiveModeChange = (mode: ResponsiveMode) => {
    setResponsiveMode(mode);

    // Resize the panel to match the selected mode
    if (resizablePanelRef.current) {
      let targetSize: number;
      switch (mode) {
        case 'mobile':
          targetSize = 25; // ~25% of available width for mobile view
          break;
        case 'tablet':
          targetSize = 50; // ~50% of available width for tablet view
          break;
        case 'desktop':
        default:
          targetSize = 100; // Full width for desktop view
          break;
      }
      resizablePanelRef.current.resize(targetSize);
    }

    trackEvent({
      name: `site_preview_responsive_${mode}_click`,
      properties: {
        category: 'engagement',
        label: `Preview Responsive ${mode.charAt(0).toUpperCase() + mode.slice(1)} Click`,
        mode,
        block_name: block.name || '',
        block_path: block.path || '',
      },
    });
  };

  return (
    <div className="h-7.5 px-1 hidden lg:flex border border-border rounded-md items-center gap-1.5">
      <Button
        mode="icon"
        size="sm"
        variant="ghost"
        className={cn('size-6 rounded-md p-0', responsiveMode === 'desktop' && 'bg-accent')}
        title="Desktop view"
        onClick={() => handleResponsiveModeChange('desktop')}
      >
        <Monitor />
      </Button>
      <Button
        mode="icon"
        size="sm"
        variant="ghost"
        className={cn('size-6 rounded-md p-0', responsiveMode === 'tablet' && 'bg-accent')}
        title="Tablet view"
        onClick={() => handleResponsiveModeChange('tablet')}
      >
        <Tablet />
      </Button>
      <Button
        mode="icon"
        size="sm"
        variant="ghost"
        className={cn('size-6 rounded-md p-0', responsiveMode === 'mobile' && 'bg-accent')}
        title="Mobile view"
        onClick={() => handleResponsiveModeChange('mobile')}
      >
        <Smartphone />
      </Button>
    </div>
  );
}

function PreviewPanelToolbarTabs() {
  const { setView, block } = usePreviewPanel();

  const handleTabClick = (value: string) => {
    trackEvent({
      name: `site_preview_${value}_tab_click`,
      properties: {
        category: 'navigation',
        label: `Preview ${value.charAt(0).toUpperCase() + value.slice(1)} Tab Click`,
        tab: value,
        block_name: block.name || '',
        block_path: block.path || '',
      },
    });
  };

  return (
    <Tabs
      defaultValue="preview"
      onValueChange={(value: string) => {
        setView(value as 'preview' | 'code');
        handleTabClick(value);
      }}
      className="hidden lg:flex"
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
  );
}

function ThemeToggleButton() {
  const { resolvedTheme } = useTheme();
  const { theme, setTheme, block } = usePreviewPanel();
  const [activeTheme, setActiveTheme] = useState<string | undefined>(undefined);

  useEffect(() => {
    setActiveTheme(theme === '' ? resolvedTheme : theme);
  }, [theme, resolvedTheme]);

  const toggleTheme = () => {
    const newTheme = activeTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    trackEvent({
      name: `site_preview_theme_${newTheme}_click`,
      properties: {
        category: 'engagement',
        label: `Preview Theme ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Click`,
        theme: newTheme,
        block_name: block.name || '',
        block_path: block.path || '',
      },
    });
  };

  return (
    <Button mode="icon" size="sm" variant="outline" onClick={toggleTheme}>
      {activeTheme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
}

function RtlToggleButton() {
  const { rtl, setRtl, block } = usePreviewPanel();

  const toggleRtl = () => {
    const newRtl = !rtl;
    setRtl(newRtl);
    trackEvent({
      name: `site_preview_direction_${newRtl ? 'rtl' : 'ltr'}_click`,
      properties: {
        category: 'engagement',
        label: `Preview Direction ${newRtl ? 'RTL' : 'LTR'} Click`,
        direction: newRtl ? 'rtl' : 'ltr',
        block_name: block.name || '',
        block_path: block.path || '',
      },
    });
  };

  return (
    <Button mode="icon" size="sm" variant="outline" className="text-muted-foreground text-[0.6rem]" onClick={toggleRtl}>
      {rtl ? 'LTR' : 'RTL'}
    </Button>
  );
}

function PreviewPanelToolbarButtons() {
  const { block, reloadPreview } = usePreviewPanel();

  const handleOpenClick = () => {
    trackEvent({
      name: 'site_preview_open_new_tab_click',
      properties: {
        category: 'engagement',
        label: 'Preview Open in New Tab Click',
        path: block.path || '',
      },
    });
  };

  const handleReloadClick = () => {
    trackEvent({
      name: 'site_preview_reload_click',
      properties: {
        category: 'engagement',
        label: 'Preview Reload Click',
        block_name: block.name || '',
        block_path: block.path || '',
      },
    });
    reloadPreview();
  };

  return (
    <div className="flex items-center gap-2">
      <ThemeToggleButton />

      <RtlToggleButton />

      <Button mode="icon" size="sm" variant="outline" title="Reload Preview" onClick={handleReloadClick}>
        <RefreshCcw />
      </Button>

      <Button mode="icon" size="sm" variant="outline" asChild title="Open in New Tab">
        <Link href={`/preview/${block.path}`} target="_blank" onClick={handleOpenClick}>
          <ArrowUpRight />
        </Link>
      </Button>

      {block.name && <OpenInV0Button name={block.name} className="" />}
    </div>
  );
}

function PreviewPanelView() {
  const { theme, rtl, view, resizablePanelRef, reloadKey, block, setPanelWidth } = usePreviewPanel();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const panelContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe?.contentDocument?.documentElement) {
      const iframeDocument = iframe.contentDocument.documentElement;
      if (theme === 'dark') {
        iframeDocument.classList.remove('light');
        iframeDocument.classList.add('dark');
      }
      if (theme === 'light') {
        iframeDocument.classList.remove('dark');
        iframeDocument.classList.add('light');
      }
      iframeDocument.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    }
  }, [theme, rtl]);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = toAbsoluteUrl('/preview/' + block.path) || '#';
    }
  }, [block.path, reloadKey]);

  // Track panel width changes using ResizeObserver
  useEffect(() => {
    const panelContainer = panelContainerRef.current;
    if (!panelContainer) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setPanelWidth(width);
      }
    });

    resizeObserver.observe(panelContainer);

    return () => {
      resizeObserver.unobserve(panelContainer);
    };
  }, [setPanelWidth]);

  const [loading, setLoading] = useState<boolean>(true);

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className={cn('relative -mr-3', view !== 'preview' && 'hidden', theme === 'dark' && 'dark')}>
      <div className="absolute inset-0 rounded-xl right-4 bg-muted/30 overflow-hidden">
        <div className="absolute inset-0 rounded-xl [background-image:radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:16px_16px] dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"></div>
      </div>
      <ResizablePanelGroup direction="horizontal" className="relative z-10 h-full">
        <ResizablePanel
          ref={resizablePanelRef}
          className="relative rounded-xl border border-border bg-background md:aspect-auto"
          defaultSize={100}
          minSize={30}
        >
          <div ref={panelContainerRef} className="h-full w-full">
            <iframe
              ref={iframeRef}
              onLoad={handleLoad}
              src={toAbsoluteUrl('/preview/' + block.path) || '#'}
              className="relative w-full h-(--height) overflow-auto bg-background"
            />
            {loading && (
              <div className="z-[1] absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 h-full min-h-screen text-xs flex items-center justify-center gap-1.5 text-muted-foreground">
                <LoaderCircleIcon className="size-4 animate-spin" />
                Loading...
              </div>
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle className="relative hidden w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:translate-x-[-1px] after:rounded-full after:bg-border after:transition-all hover:after:h-10 md:block" />
        <ResizablePanel defaultSize={0} minSize={0} />
      </ResizablePanelGroup>
    </div>
  );
}

function PreviewPanelCode() {
  const { block, view } = usePreviewPanel();
  const { copy, copied } = useCopyToClipboard();

  return (
    <div
      className={cn('dark relative h-(--height) [&::-webkit-scrollbar-thumb:bg-white!]', view !== 'code' && 'hidden')}
    >
      <div
        className={cn(
          'relative flex items-stretch h-full overflow-hidden rounded-xl bg-card text-foreground border border-border',
        )}
      >
        {/* Code Viewer */}
        <div className="grow">
          <div className="flex items-center justify-between bg-card px-5 h-12 text-sm border-b border-border">
            <div className="inline-flex gap-2.5 items-center">
              <File className="size-4 opacity-60" />
              {block.relativePath}
            </div>
            <Button
              mode="icon"
              size="sm"
              variant="ghost"
              className="size-8 -me-2.5"
              onClick={() => {
                if (block?.code) {
                  copy(block.code);
                  // Track the block code copy event
                  if (block.name) {
                    trackBlockCodeCopy(block.name, block.path);
                  }
                }
              }}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="grid h-full">
            <PreviewPanelCodeHighlight block={block} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewPanelCodeHighlight({ block }: { block: BlockItem }) {
  return (
    <div className="relative overflow-hidden grow">
      <div>
        <div className={cn('relative overflow-hidden rounded-xl')}>
          <div
            data-rehype-pretty-code-fragment
            dangerouslySetInnerHTML={{ __html: block.highlightedCode || '' }}
            className="
              relative [tab-size:2]
              flex-1
              p-0
              m-0
              before:bg-card
              overflow-hidden
              after:absolute
              after:inset-y-0
              after:left-0
              after:w-10
              after:bg-card
              [&_.line:before]:sticky
              [&_.line:before]:left-2
              [&_.line:before]:z-10
              [&_.line:before]:translate-y-[-1px]
              [&_.line:before]:pr-1
              [&_pre]:max-h-[calc(var(--height)-2rem)]
              [&_pre]:overflow-auto
              [&_pre]:!bg-transparent
              [&_pre]:pt-4
              [&_pre]:font-mono
              [&_pre]:text-sm
              [&_pre]:leading-relaxed
            "
          />
        </div>
      </div>
    </div>
  );
}

export function BlockPreview({ block }: { block: BlockItem }) {
  if (!block) {
    return null;
  }

  return (
    <div
      className="flex items-stretch w-full h-full"
      style={
        {
          '--height': `${block?.previewHeight || '600'}px`,
        } as React.CSSProperties
      }
    >
      <PreviewPanelProvider block={block}>
        <PreviewPanelToolbar />
        <PreviewPanelView />
        <PreviewPanelCode />
      </PreviewPanelProvider>
    </div>
  );
}
