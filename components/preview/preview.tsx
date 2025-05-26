'use client';

import path from 'path';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useCopyToClipboard } from '@/registry/default/hooks/use-copy-to-clipboard';
import { cn } from '@/registry/default/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/registry/default/ui/accordion';
import { Button } from '@/registry/default/ui/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/registry/default/ui/resizable';
import { Separator } from '@/registry/default/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/registry/default/ui/tabs';
import {
  ArrowUpRight,
  Check,
  Copy,
  File,
  Folder,
  FolderOpen,
  LoaderCircleIcon,
  Moon,
  RefreshCcw,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { ImperativePanelHandle } from 'react-resizable-panels';
import {
  PreviewFilesTree,
  PreviewItem,
  PreviewItemFile,
  PreviewMode,
} from '@/config/types';
import { trackEvent } from '@/lib/analytics';

type ThemeType = 'dark' | 'light' | '';

type PreviewPanelContext = {
  item: PreviewItem;
  path: string;
  mode?: PreviewMode;
  view: 'code' | 'preview';
  setView: (view: 'code' | 'preview') => void;
  activeFile: PreviewItemFile | null;
  setActiveFile: (file: PreviewItemFile) => void;
  resizablePanelRef: React.RefObject<ImperativePanelHandle | null>;
  theme: ThemeType;
  setTheme: React.Dispatch<React.SetStateAction<ThemeType>>;
  rtl: boolean;
  setRtl: React.Dispatch<React.SetStateAction<boolean>>;
  reloadKey: number;
  reloadPreview: () => void;
};

export interface PreviewPanelProps {
  path: string;
  mode?: PreviewMode;
  item?: PreviewItem;
}

const PreviewPanelContext = React.createContext<PreviewPanelContext | null>(
  null,
);

function usePreviewPanel() {
  const context = React.useContext(PreviewPanelContext);
  if (!context) {
    throw new Error(
      'usePreviewPanel must be used within a PreviewPanelProvider.',
    );
  }
  return context;
}

function PreviewPanelProvider({
  item,
  path,
  mode,
  children,
}: {
  item: PreviewItem;
  path: string;
  mode?: PreviewMode;
  children: React.ReactNode;
}) {
  const [view, setView] = useState<PreviewPanelContext['view']>('preview');
  const [activeFile, setActiveFile] =
    useState<PreviewPanelContext['activeFile']>(null);
  const resizablePanelRef = useRef<ImperativePanelHandle | null>(null);

  const [theme, setTheme] = useState<ThemeType>('');
  const [rtl, setRtl] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const reloadPreview = () => {
    setReloadKey((prev) => prev + 1);
  };

  // Set activeFile for block mode when item.file is available
  useEffect(() => {
    if (mode === 'block' && item.file && !activeFile) {
      setActiveFile(item.file);
    }
  }, [mode, item.file, activeFile]);

  return (
    <PreviewPanelContext.Provider
      value={{
        item,
        path,
        mode,
        view,
        setView,
        activeFile,
        setActiveFile,
        resizablePanelRef,
        theme,
        setTheme,
        rtl,
        setRtl,
        reloadKey,
        reloadPreview,
      }}
    >
      <div
        id={path}
        data-view={view}
        className="flex min-w-0 flex-col items-stretch w-full"
      >
        {children}
      </div>
    </PreviewPanelContext.Provider>
  );
}

function PreviewPanelToolbar() {
  const { item } = usePreviewPanel();

  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-');
  };

  return (
    <div className="flex items-center gap-2.5 justify-between mb-3">
      <div className="flex items-center grow gap-2">
        <h2 className="text-base font-semibold">
          {item.title}
          <a id={slugify(item.title)}></a>
        </h2>
      </div>
      <div className={cn('flex items-center justify-between gap-2')}>
        <PreviewPanelToolbarTabs />
        <Separator orientation="vertical" className="mx-2 hidden h-5 xl:flex" />
        <PreviewPanelToolbarButtons />
      </div>
    </div>
  );
}

function PreviewPanelToolbarTabs() {
  const { setView } = usePreviewPanel();

  const handleTabClick = (value: string) => {
    trackEvent({
      name: `site_preview_${value}_tab_click`,
      properties: {
        category: 'navigation',
        label: `Preview ${value.charAt(0).toUpperCase() + value.slice(1)} Tab Click`,
        tab: value,
      },
    });
  };

  return (
    <Tabs
      defaultValue="preview"
      onValueChange={(value) => {
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
  const { theme, setTheme } = usePreviewPanel();
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
      },
    });
  };

  return (
    <Button
      mode="icon"
      size="sm"
      variant="outline"
      className="h-8 w-8 rounded-md p-0 text-muted-foreground"
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
  const { rtl, setRtl } = usePreviewPanel();

  const toggleRtl = () => {
    const newRtl = !rtl;
    setRtl(newRtl);
    trackEvent({
      name: `site_preview_direction_${newRtl ? 'rtl' : 'ltr'}_click`,
      properties: {
        category: 'engagement',
        label: `Preview Direction ${newRtl ? 'RTL' : 'LTR'} Click`,
        direction: newRtl ? 'rtl' : 'ltr',
      },
    });
  };

  return (
    <Button
      mode="icon"
      size="sm"
      variant="outline"
      className={cn(
        'h-8 w-8 rounded-md p-0 text-muted-foreground',
        'inline-flex items-center leading-none text-[0.65rem]',
      )}
      onClick={toggleRtl}
    >
      {rtl ? 'LTR' : 'RTL'}
    </Button>
  );
}

function PreviewPanelToolbarButtons() {
  const { path, reloadPreview } = usePreviewPanel();
  const btnClass = 'h-8 w-8 rounded-md p-0 text-muted-foreground';
  const btnIconClass = 'h-3.5 w-3.5';

  const handleOpenClick = () => {
    trackEvent({
      name: 'site_preview_open_new_tab_click',
      properties: {
        category: 'engagement',
        label: 'Preview Open in New Tab Click',
        path,
      },
    });
  };

  const handleReloadClick = () => {
    trackEvent({
      name: 'site_preview_reload_click',
      properties: {
        category: 'engagement',
        label: 'Preview Reload Click',
      },
    });
    reloadPreview();
  };

  return (
    <div className="flex items-center gap-2">
      <ThemeToggleButton />
      <RtlToggleButton />
      <Button
        mode="icon"
        size="sm"
        variant="outline"
        className={btnClass}
        asChild
      >
        <Link href={`${path}`} target="_blank" onClick={handleOpenClick}>
          <ArrowUpRight className={btnIconClass} />
        </Link>
      </Button>
      <Button
        mode="icon"
        size="sm"
        variant="outline"
        className={btnClass}
        onClick={handleReloadClick}
      >
        <RefreshCcw className={btnIconClass} />
      </Button>
    </div>
  );
}

function PreviewPanelView() {
  const { theme, rtl, path, view, resizablePanelRef, reloadKey } =
    usePreviewPanel();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

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
      iframeRef.current.src = path;
    }
  }, [path, reloadKey]);

  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div
      className={cn(
        '-mr-3',
        view !== 'preview' && 'hidden',
        theme === 'dark' && 'dark',
      )}
    >
      <ResizablePanelGroup
        direction="horizontal"
        className="relative z-10 h-full"
      >
        <ResizablePanel
          ref={resizablePanelRef}
          className="relative rounded-xl border border-border bg-background md:aspect-auto"
          defaultSize={100}
          minSize={30}
        >
          <div className="flex items-center bg-accent/50 dark:bg-accent/90 rounded-t-xl px-3 py-3.5">
            <div className="flex items-center gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="size-2.5 shrink-0 bg-muted-foreground/15 rounded-full"
                ></div>
              ))}
            </div>
          </div>
          <iframe
            ref={iframeRef}
            onLoad={handleLoad}
            src={path}
            className="relative w-full h-(--height) overflow-auto bg-background"
          />
          {loading && (
            <div className="z-[1] absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 h-full min-h-screen text-xs flex items-center justify-center gap-1.5 text-muted-foreground">
              <LoaderCircleIcon className="size-4 animate-spin" />
              Loading...
            </div>
          )}
        </ResizablePanel>
        <ResizableHandle className="relative hidden w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:translate-x-[-1px] after:rounded-full after:bg-border after:transition-all hover:after:h-10 md:block" />
        <ResizablePanel defaultSize={0} minSize={0} />
      </ResizablePanelGroup>
    </div>
  );
}

function PreviewPanelCode() {
  const { item, mode, view, activeFile, setActiveFile } = usePreviewPanel();
  const { copy, copied } = useCopyToClipboard();
  const [openItems, setOpenItems] = useState<string[]>(['app']);

  // Handle file tree for non-block mode
  useEffect(() => {
    if (mode !== 'block' && item.files && !activeFile) {
      const findFirstFile = (
        nodes: PreviewFilesTree[] | PreviewFilesTree,
        level: number = 0,
      ): PreviewItemFile | null => {
        const nodeList = Array.isArray(nodes) ? nodes : [nodes];
        for (const node of nodeList) {
          if (
            level === 0 &&
            node.type === 'folder' &&
            node.name === 'app' &&
            node.children
          ) {
            const result = findFirstFile(node.children, level + 1);
            if (result) return result;
          }
          if (node.type === 'file' && node.meta) {
            return node.meta;
          }
          if (node.type === 'folder' && node.children) {
            const result = findFirstFile(node.children, level + 1);
            if (result) return result;
          }
        }
        return null;
      };

      const firstFile = findFirstFile(item.files);
      if (firstFile) {
        setActiveFile(firstFile);
        const segments = firstFile.path.split(path.sep);
        const parentPaths: string[] = [];
        for (let i = 0; i < segments.length - 1; i++) {
          parentPaths.push(segments.slice(0, i + 1).join(path.sep));
        }
        setOpenItems(parentPaths);
      }
    }
  }, [mode, item.files, activeFile, setActiveFile]);

  const handleFileSelect = (file: PreviewItemFile) => {
    setActiveFile(file);
  };

  const renderTree = (
    nodes: PreviewFilesTree[] | PreviewFilesTree,
    level: number = 0,
  ) => {
    const spacingEnd = 'pe-[20px]';
    const spacing = [
      'ps-[20px]',
      'ps-[30px]',
      'ps-[40px]',
      'ps-[50px]',
      'ps-[60px]',
      'ps-[70px]',
      'ps-[80px]',
      'ps-[90px]',
    ];

    const nodeList = Array.isArray(nodes) ? nodes : [nodes];
    return nodeList.map((node) => {
      if (node.type === 'file' && node.meta) {
        return (
          <div
            key={node.path}
            className={cn(
              `flex flex-row justify-start items-center gap-1.5 cursor-pointer pe-[15px] py-1.5 hover:bg-accent`,
              spacing[level],
              spacingEnd,
              activeFile?.path === node.meta.path && 'bg-accent',
            )}
            onClick={() => handleFileSelect(node.meta as PreviewItemFile)}
          >
            <span>
              <File className="size-4 opacity-50" />
            </span>
            {node.name}
          </div>
        );
      }
      if (node.type === 'folder' && node.children) {
        const isOpen = openItems.includes(node.path);
        return (
          <AccordionItem
            key={node.path}
            value={node.path}
            className="border-0 p-0"
          >
            <AccordionTrigger
              className={cn(
                'flex flex-row justify-start items-center gap-1.5 no-underline hover:no-underline hover:bg-accent py-1.5 [&_svg]:hidden',
                spacing[level],
                spacingEnd,
              )}
            >
              <span>
                {isOpen ? (
                  <FolderOpen className="size-4 opacity-50 inline-block!" />
                ) : (
                  <Folder className="size-4 opacity-50 inline-block!" />
                )}
              </span>
              {node.name}
            </AccordionTrigger>
            <AccordionContent className="p-0">
              {renderTree(node.children, level + 1)}
            </AccordionContent>
          </AccordionItem>
        );
      }
      return null;
    });
  };

  return (
    <div
      className={cn(
        'dark relative h-(--height) [&::-webkit-scrollbar-thumb:bg-white!]',
        view !== 'code' && 'hidden',
      )}
    >
      <div
        className={cn(
          'relative flex items-stretch h-full overflow-hidden rounded-xl bg-card text-foreground border border-border',
        )}
      >
        {/* Sidebar (only for non-block mode) */}
        {mode !== 'block' && (
          <div className="w-[350px] shrink-0 border-r border-border">
            <div className="flex items-center px-5 border-b border-border h-12 text-sm">
              <div>Files</div>
            </div>
            <div className="grid h-full w-full text-sm">
              <div className="overflow-auto">
                <Accordion
                  type="multiple"
                  value={openItems}
                  onValueChange={(values) => setOpenItems(values)}
                >
                  {item.files ? renderTree(item.files) : 'No files available'}
                </Accordion>
              </div>
            </div>
          </div>
        )}

        {/* Code Viewer */}
        <div className={mode === 'block' ? 'w-full' : 'grow'}>
          <div className="flex items-center justify-between bg-card px-5 h-12 text-sm border-b border-border">
            <div className="inline-flex gap-2.5 items-center">
              <File className="size-4 opacity-60" />
              {(activeFile?.path || '') + activeFile?.filename ||
                (mode === 'block' ? item.file?.filename : 'No file selected')}
            </div>
            <Button
              mode="icon"
              size="sm"
              variant="ghost"
              className="size-8 -me-2.5"
              onClick={() => {
                if (activeFile?.code) {
                  copy(activeFile.code);
                }
              }}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="grid h-full">
            {activeFile && <PreviewPanelCodeHighlight file={activeFile} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewPanelCodeHighlight({ file }: { file: PreviewItemFile }) {
  return (
    <div className="relative overflow-hidden grow">
      <div>
        <div className={cn('relative overflow-hidden rounded-xl')}>
          <div
            data-rehype-pretty-code-fragment
            dangerouslySetInnerHTML={{ __html: file.highlightedCode || '' }}
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

export function Preview({ path, mode, item }: PreviewPanelProps) {
  if (!item) {
    return null;
  }

  return (
    <div
      className="flex items-stretch w-full h-full"
      style={
        {
          '--height': `${item?.previewHeight || ''}px`,
        } as React.CSSProperties
      }
    >
      <PreviewPanelProvider item={item} path={path} mode={mode}>
        <PreviewPanelToolbar />
        <PreviewPanelView />
        <PreviewPanelCode />
      </PreviewPanelProvider>
    </div>
  );
}
