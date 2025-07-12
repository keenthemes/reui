'use client';

import React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { Collapsible as BaseCollapsible } from '@base-ui-components/react/collapsible';

function Collapsible({ ...props }: React.ComponentProps<typeof BaseCollapsible.Root>) {
  return <BaseCollapsible.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({
  children,
  className,
  asChild = false,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Trigger> & { asChild?: boolean }) {
  const triggerProps = {
    'data-slot': 'alert-dialog-trigger' as const,
    className,
    ...props,
    ...(asChild && {
      render: children as React.ReactElement<Record<string, unknown>, string | React.JSXElementConstructor<unknown>>,
    }),
  };

  return asChild ? (
    <BaseCollapsible.Trigger {...triggerProps} />
  ) : (
    <BaseCollapsible.Trigger {...triggerProps}>{children}</BaseCollapsible.Trigger>
  );
}

function CollapsiblePanel({ className, children, ...props }: React.ComponentProps<typeof BaseCollapsible.Panel>) {
  return (
    <BaseCollapsible.Panel
      data-slot="collapsible-panel"
      className={cn(
        'overflow-hidden h-[var(--collapsible-panel-height)] transition-all ease-out data-[ending-style]:h-0 data-[starting-style]:h-0',
        className,
      )}
      {...props}
    >
      {children}
    </BaseCollapsible.Panel>
  );
}

export { Collapsible, CollapsiblePanel, CollapsibleTrigger };
