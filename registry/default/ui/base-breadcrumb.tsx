import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { mergeProps } from '@base-ui-components/react/merge-props';
import { useRender } from '@base-ui-components/react/use-render';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

export interface BreadcrumbLinkProps extends useRender.ComponentProps<'a'> {
  asChild?: boolean;
}

function Breadcrumb(props: React.ComponentProps<'nav'>) {
  return <nav data-slot="breadcrumb" aria-label="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn('flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="breadcrumb-item" className={cn('inline-flex items-center gap-1.5', className)} {...props} />;
}

function BreadcrumbLink({ render, asChild = false, children, className, ...props }: BreadcrumbLinkProps) {
  const defaultProps = {
    'data-slot': 'breadcrumb-link',
    className: cn('transition-colors hover:text-foreground', className),
  };

  // Determine render element based on asChild prop
  const renderElement =
    asChild && React.isValidElement(children)
      ? (children as React.ReactElement<Record<string, unknown>, string | React.JSXElementConstructor<unknown>>)
      : render || <a />;

  // When using asChild, children becomes the element props, otherwise use children normally
  const finalProps =
    asChild && React.isValidElement(children)
      ? mergeProps(defaultProps, props)
      : mergeProps(defaultProps, { ...props, children });

  const element = useRender({
    render: renderElement,
    props: finalProps,
  });

  return element;
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('font-normal text-foreground', className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn('[&>svg]:w-3.5 [&>svg]:h-3.5', className)}
      {...props}
    >
      {children ?? <ChevronRight className="rtl:rotate-180" />}
    </li>
  );
}

function BreadcrumbEllipsis({ children, className, ...props }: React.ComponentProps<'span'>) {
  const content = children ?? (
    <>
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More</span>
    </>
  );

  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn('flex h-9 w-9 items-center justify-center', className)}
      {...props}
    >
      {content}
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
