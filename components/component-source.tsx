'use client';

import React, { ReactNode, useState } from 'react';
import { useCopyToClipboard } from '@/registry/default/hooks/use-copy-to-clipboard';
import { cn } from '@/registry/default/lib/utils';
import { Button } from '@/registry/default/ui/button';
import { Check, Copy } from 'lucide-react';
import { trackCodeCopy } from '@/lib/analytics';

type ComponentSourceContext = {
  name: string;
  highlightedCode: string;
  code: string;
  codeHeight?: number;
  collapsedHeight?: number;
  codeCollapsed: boolean;
  toggleCodeCollapsed: () => void;
  children: ReactNode;
};

export interface ComponentSourceProps {
  name: string;
  code: string;
  highlightedCode: string;
  codeHeight?: number;
  collapsedHeight?: number;
  codeCollapsed?: boolean;
}

const ComponentSourceContext = React.createContext<ComponentSourceContext | null>(null);

export function useComponentSource() {
  const context = React.useContext(ComponentSourceContext);
  if (!context) {
    throw new Error('useComponentSource must be used within a ComponentSourceProvider.');
  }
  return context;
}

function ComponentSourceProvider({
  name,
  code,
  highlightedCode,
  codeHeight = 300,
  collapsedHeight = 100, // Default collapsed height
  codeCollapsed = false,
  children,
}: ComponentSourceProps & { children: ReactNode }) {
  const [isCodeCollapsed, setIsCodeCollapsed] = useState(codeCollapsed);

  const toggleCodeCollapsed = () => setIsCodeCollapsed((prev) => !prev);

  return (
    <ComponentSourceContext.Provider
      value={{
        name,
        code,
        highlightedCode,
        codeHeight,
        collapsedHeight,
        codeCollapsed: isCodeCollapsed,
        toggleCodeCollapsed,
        children,
      }}
    >
      <div
        className="group/block-view-wrapper flex min-w-0 flex-col items-stretch gap-4"
        style={
          {
            '--height': `${codeHeight}px`,
            '--collapsed-height': `${collapsedHeight}px`,
            overflow: isCodeCollapsed ? 'hidden' : 'visible',
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </ComponentSourceContext.Provider>
  );
}

function PreviewCopyCodeButton() {
  const { code, name } = useComponentSource();
  const { copy, copied } = useCopyToClipboard();
  const btnClass = 'h-6 w-6 rounded-md p-0 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50 absolute top-4 end-4';
  const btnIconClass = 'h-3.5 w-3.5';

  return (
    <Button
      mode="icon"
      size="sm"
      variant="ghost"
      className={btnClass}
      onClick={() => {
        copy(code);
        trackCodeCopy(name);
      }}
    >
      {copied ? <Check className={btnIconClass} /> : <Copy className={btnIconClass} />}
    </Button>
  );
}

function PreviewCollapseToggleButton() {
  const { codeCollapsed, toggleCodeCollapsed } = useComponentSource();

  return (
    <div className="absolute bottom-0 start-0 end-0 flex items-center justify-center z-10 h-16 w-full select-none bg-gradient-to-b from-transparent to-neutral-800 dark:to-bg-neutral-900">
      <Button
        size="sm"
        variant="outline"
        className="border-border/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-50  hover:text-zinc-50"
        onClick={toggleCodeCollapsed}
      >
        {codeCollapsed ? 'Show more' : 'Show less'}
      </Button>
    </div>
  );
}

function ComponentSourceCode() {
  const { highlightedCode, codeCollapsed } = useComponentSource();

  return (
    <div>
      <div className={cn('relative overflow-hidden rounded-xl bg-neutral-950 dark:bg-neutral-900 text-white')}>
        <div
          data-rehype-pretty-code-fragment
          dangerouslySetInnerHTML={{ __html: highlightedCode || '' }}
          className={cn(
            'relative [tab-size:2] flex-1 overflow-hidden after:absolute after:inset-y-0 after:left-0 after:w-10 after:bg-neutral-950 dark:after:bg-neutral-900 [&_.line:before]:sticky [&_.line:before]:left-2 [&_.line:before]:z-10 [&_.line:before]:translate-y-[-1px] [&_.line:before]:pr-1 [&_pre]:max-h-(--height) [&_pre]:overflow-auto [&_pre]:!bg-transparent [&_pre]:pt-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed',
            codeCollapsed ? '[&_pre]:max-h-[var(--collapsed-height)]' : '[&_pre]:max-h-[var(--height)]',
          )}
        />
        <PreviewCopyCodeButton />
        <PreviewCollapseToggleButton />
      </div>
    </div>
  );
}

export function ComponentSource({
  name,
  code,
  highlightedCode,
  codeHeight = 800,
  collapsedHeight = 300,
  codeCollapsed = true,
}: ComponentSourceProps) {
  if (!code) {
    return null;
  }

  return (
    <div className="pt-3.5 mb-14">
      <ComponentSourceProvider
        name={name}
        code={code}
        highlightedCode={highlightedCode}
        codeHeight={codeHeight}
        collapsedHeight={collapsedHeight}
        codeCollapsed={codeCollapsed}
      >
        <ComponentSourceCode />
      </ComponentSourceProvider>
    </div>
  );
}
