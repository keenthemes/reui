import React, { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/registry/default/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/registry/default/ui/accordion';
import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { AspectRatio } from '@/registry/default/ui/aspect-ratio';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/default/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/default/ui/tabs';
import { PopoverContentProps } from '@radix-ui/react-popover';
import { BookOpenCheck, CircleAlert, ExternalLink, Minus } from 'lucide-react';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import { ComponentCode, ComponentExamples, ExampleCodesProps, ExamplePreviewProps } from '@/config/types';
import { Event } from '@/lib/events';
import { Callout } from '@/components/callout';
import { CopyButton } from '@/components/copy-button';
import { FrameworkDocs } from '@/components/framework-docs';
import CliCommands from './cli-commands';
import { ComponentPreview } from './component-preview';
import { ComponentSource } from './component-source';

export { isType } from 'contentlayer2/client';

const components = (componentExamples: ComponentExamples | undefined, componentCode: ComponentCode | undefined) => ({
  ExamplePreview: ({ path, ...props }: ExamplePreviewProps) => {
    if (!componentExamples) return <></>;

    const example = componentExamples[path];
    if (!example) {
      console.warn(`No preview item found for path: ${path}`);
      return null;
    }
    return <ComponentPreview {...props} path={path} code={example.code} highlightedCode={example.highlightedCode} />;
  },
  ComponentPreview: ({ name, ...props }: ExampleCodesProps) => {
    if (!componentCode) return <></>;

    const code = componentCode[name];
    if (!code) {
      console.log(`No preview item found for path: ${name}`);
      return null;
    }

    console.log(`Wow: ${code}`);

    return <ComponentSource {...props} name={name} code={code.code} highlightedCode={code.highlightedCode} />;
  },
  PopoverInfo: ({
    children,
    width,
    props = { side: 'top' },
  }: {
    children: ReactNode;
    width: string;
    props: PopoverContentProps;
  }) => {
    return (
      <Popover>
        <PopoverTrigger className="inline-flex" asChild>
          <CircleAlert className="size-3.5 text-muted-foreground/80 ms-[1px] mt-[-2px]" />
        </PopoverTrigger>
        <PopoverContent className={cn('text-wrap max-w-56 text-accent-foreground text-sm', width)} {...props}>
          {children}
        </PopoverContent>
      </Popover>
    );
  },
  Na: () => {
    return <Minus className="text-accent-foreground size-3.5" strokeWidth="1" />;
  },
  CliCommands,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertContent,
  AlertDescription,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Minus,
  BookOpenCheck,
  CircleAlert,
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={cn('font-heading mt-2 scroll-m-20 text-2xl font-bold', className)} {...props} />
  ),
  h2: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn('font-heading mt-12 scroll-m-15 text-xl font-semibold tracking-tight first:mt-0', className)}
      {...props}
    >
      <span>{children}</span>
    </h2>
  ),
  h3: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn('font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight', className)} {...props}>
      <span>{children}</span>
    </h3>
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className={cn('font-heading mt-8 scroll-m-20 text-base font-semibold tracking-tight', className)} {...props} />
  ),
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 className={cn('mt-8 scroll-m-20 text-base font-semibold tracking-tight', className)} {...props} />
  ),
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6 className={cn('mt-8 scroll-m-20 text-base font-semibold tracking-tight', className)} {...props} />
  ),
  a: ({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = props.href?.startsWith('http');

    return (
      <a
        className={cn(
          'font-medium text-primary hover:text-primary hover:underline hover:underline-offset-2 transition-all',
          className,
          isExternal && 'inline-flex gap-1 items-center',
        )}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {props.children}
        {isExternal && <ExternalLink className="size-3.5" />}
      </a>
    );
  },
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn('not-first:mt-4', className)} {...props} />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn('my-6 ml-6 list-disc marker:text-muted-foreground', className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <li className={cn('mt-2', className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote className={cn('mt-6 border-l-2 pl-6 italic', className)} {...props} />
  ),
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className={cn('font-semibold', className)} {...props} />
  ),
  img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img className={cn('rounded-lg border border-input', className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => <hr className="my-4 md:my-8" {...props} />,
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="table-fixed my-6 w-full overflow-y-auto border border-border/50 text-sm rounded-md">
      <table
        className={cn('min-w-[750px] relative w-full overflow-hidden border-none text-sm', className)}
        {...props}
      />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn('last:border-b-0 m-0 border-b border-border/50 [&>*:last-child]:border-r-0', className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        'first:text-nowrap px-4 py-2 bg-accent/50 border-b border-r border-border/50 text-left font-semibold text-muted-foreground/90 [&[align=center]]:text-center [&[align=right]]:text-right',
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        'first:text-nowrap px-4 py-3.5 text-left border-r border-border/50 [&[align=center]]:text-center text-muted-foreground [&[align=right]]:text-right has-[em]:py-2.5 [&>em]:not-italic [&>em]:font-semibold [&>em]:uppercase [&>em]:text-[0.7rem]',
        className,
      )}
      {...props}
    />
  ),
  pre: ({
    className,
    __rawString__,
    __withMeta__,
    __src__,
    __event__,
    ...props
  }: React.HTMLAttributes<HTMLPreElement> & {
    __rawString__?: string;
    __withMeta__?: boolean;
    __src__?: string;
    __event__?: Event['name'];
  }) => {
    return (
      <>
        <pre
          className={cn(
            'relative [tab-size:2] [&_code:not([data-line-numbers])]:!ps-4 mb-4 mt-2 max-h-[650px] overflow-x-auto rounded-xl border py-4 bg-neutral-950! dark:bg-neutral-900! [&_code]:bg-neutral-950! dark:[&_code]:bg-neutral-900!',
            className,
          )}
          {...props}
        />
        {__rawString__ && (
          <CopyButton
            value={__rawString__}
            src={__src__}
            event={__event__}
            className={cn(
              'absolute rounded-md bg-neutral-950 dark:bg-neutral-900 right-4 top-4',
              __withMeta__ && 'top-16',
            )}
          />
        )}
      </>
    );
  },
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        'relative rounded-sm bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[13px]',
        'text-primary',
        className,
      )}
      {...props}
    />
  ),
  Callout,
  AspectRatio,
  Step: ({ className, ...props }: React.ComponentProps<'h3'>) => (
    <h3 className={cn('font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight', className)} {...props} />
  ),
  Steps: ({ ...props }) => (
    <div className="[&>h3]:step steps mb-12 ml-4 border-l pl-8 [counter-reset:step]" {...props} />
  ),
  Tabs: ({ className, ...props }: React.ComponentProps<typeof Tabs>) => (
    <Tabs className={cn('relative mt-6 w-full', className)} {...props} />
  ),
  TabsList: ({ className, ...props }: React.ComponentProps<typeof TabsList>) => (
    <TabsList
      className={cn('flex gap-4 w-full justify-start rounded-none border-b bg-transparent p-0 mb-5', className)}
      {...props}
    />
  ),
  TabsTrigger: ({ className, ...props }: React.ComponentProps<typeof TabsTrigger>) => (
    <TabsTrigger
      className={cn(
        'relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-zinc-950 dark:data-[state=active]:border-b-zinc-300 data-[state=active]:text-foreground data-[state=active]:shadow-none',
        className,
      )}
      {...props}
    />
  ),
  TabsContent: ({ className, ...props }: React.ComponentProps<typeof TabsContent>) => (
    <TabsContent
      className={cn('relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-semibold', className)}
      {...props}
    />
  ),
  FrameworkDocs: ({ className, ...props }: React.ComponentProps<typeof FrameworkDocs>) => (
    <FrameworkDocs className={cn(className)} {...props} />
  ),
  Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn(
        'font-medium text-primary hover:text-primary hover:underline hover:underline-offset-2 transition-all',
        className,
      )}
      {...props}
    />
  ),
  LinkedCard: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn(
        'flex w-full flex-col items-center rounded-xl border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-muted/50 sm:p-10',
        className,
      )}
      {...props}
    />
  ),
});

interface MdxProps {
  code: string;
  componentExamples?: ComponentExamples;
  componentCode?: ComponentCode;
}

export function Mdx({ code, componentExamples, componentCode }: MdxProps) {
  const Component = useMDXComponent(code);

  return (
    <div className="mdx">
      <Component components={components(componentExamples, componentCode)} />
    </div>
  );
}
