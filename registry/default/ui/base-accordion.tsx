'use client';

import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { Accordion } from '@base-ui-components/react/accordion';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown, Plus } from 'lucide-react';

// Variants
const accordionRootVariants = cva('', {
  variants: {
    variant: {
      default: '',
      outline: 'space-y-2',
      solid: 'space-y-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const accordionItemVariants = cva('', {
  variants: {
    variant: {
      default: 'border-b border-border',
      outline: 'border border-border rounded-lg px-4',
      solid: 'rounded-lg bg-accent/70 px-4',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const accordionHeaderVariants = cva('flex', {
  variants: {
    variant: {
      default: '',
      outline: '',
      solid: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const accordionTriggerVariants = cva(
  'flex flex-1 items-center justify-between py-4 gap-2.5 text-foreground font-medium transition-all [&[data-panel-open]>svg]:rotate-180 cursor-pointer',
  {
    variants: {
      variant: {
        default: '',
        outline: '',
        solid: '',
      },
      indicator: {
        arrow: '',
        plus: '[&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-panel-open]>svg>path:last-child]:rotate-90 [&[data-panel-open]>svg>path:last-child]:opacity-0 [&[data-panel-open]>svg]:rotate-180',
        none: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      indicator: 'arrow',
    },
  },
);

const accordionPanelVariants = cva(
  'h-[var(--accordion-panel-height)] overflow-hidden text-sm text-accent-foreground transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0',
  {
    variants: {
      variant: {
        default: '',
        outline: '',
        solid: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

// Context
type AccordionContextType = {
  variant?: 'default' | 'outline' | 'solid';
  indicator?: 'arrow' | 'plus' | 'none';
};

const AccordionContext = React.createContext<AccordionContextType>({
  variant: 'default',
  indicator: 'arrow',
});

// Base UI Accordion Root
interface AccordionRootProps
  extends React.ComponentProps<typeof Accordion.Root>,
    VariantProps<typeof accordionRootVariants> {
  indicator?: 'arrow' | 'plus' | 'none';
}

function AccordionRoot(props: AccordionRootProps) {
  const { className, variant = 'default', indicator = 'arrow', children, ...rest } = props;

  return (
    <AccordionContext.Provider value={{ variant: variant || 'default', indicator }}>
      <Accordion.Root data-slot="accordion" className={cn(accordionRootVariants({ variant }), className)} {...rest}>
        {children}
      </Accordion.Root>
    </AccordionContext.Provider>
  );
}

// Base UI Accordion Item
function AccordionItem(props: React.ComponentProps<typeof Accordion.Item>) {
  const { className, children, ...rest } = props;
  const { variant } = React.useContext(AccordionContext);

  return (
    <Accordion.Item data-slot="accordion-item" className={cn(accordionItemVariants({ variant }), className)} {...rest}>
      {children}
    </Accordion.Item>
  );
}

// Base UI Accordion Header
function AccordionHeader(props: React.ComponentProps<typeof Accordion.Header>) {
  const { className, children, ...rest } = props;
  const { variant } = React.useContext(AccordionContext);

  return (
    <Accordion.Header
      data-slot="accordion-header"
      className={cn(accordionHeaderVariants({ variant }), className)}
      {...rest}
    >
      {children}
    </Accordion.Header>
  );
}

// Base UI Accordion Trigger
function AccordionTrigger(props: React.ComponentProps<typeof Accordion.Trigger>) {
  const { className, children, ...rest } = props;
  const { variant, indicator } = React.useContext(AccordionContext);

  return (
    <Accordion.Trigger
      data-slot="accordion-trigger"
      className={cn(accordionTriggerVariants({ variant, indicator }), className)}
      {...rest}
    >
      {children}
      {indicator === 'plus' && <Plus className="size-4 shrink-0 transition-transform duration-200" strokeWidth={1} />}
      {indicator === 'arrow' && (
        <ChevronDown className="size-4 shrink-0 transition-transform duration-200" strokeWidth={1} />
      )}
    </Accordion.Trigger>
  );
}

// Base UI Accordion Panel
function AccordionPanel(props: React.ComponentProps<typeof Accordion.Panel>) {
  const { className, children, ...rest } = props;
  const { variant } = React.useContext(AccordionContext);

  return (
    <Accordion.Panel
      data-slot="accordion-panel"
      className={cn(accordionPanelVariants({ variant }), className)}
      {...rest}
    >
      <div className={cn('pb-5 pt-0')}>{children}</div>
    </Accordion.Panel>
  );
}

// Exports with proper naming to match Base UI pattern
export { AccordionRoot as Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionPanel };
