import * as React from 'react';
import { Tooltip as TooltipPrimitive } from '@base-ui-components/react/tooltip';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

function TooltipProvider({ delay = 0, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />;
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

const tooltipVariants = cva(
  'z-55 animate-in fade-in-0 zoom-in-95 data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
  {
    variants: {
      variant: {
        default:
          'dark:border dark:border-border bg-zinc-950 text-white dark:bg-zinc-300 dark:text-black shadow-md shadow-black/5',
        light: 'border border-border bg-background text-foreground shadow-md shadow-black/5',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface TooltipContentProps
  extends React.ComponentProps<typeof TooltipPrimitive.Popup>,
    VariantProps<typeof tooltipVariants> {
  sideOffset?: TooltipPrimitive.Positioner.Props['sideOffset'];
  side?: TooltipPrimitive.Positioner.Props['side'];
  align?: TooltipPrimitive.Positioner.Props['align'];
  alignOffset?: TooltipPrimitive.Positioner.Props['alignOffset'];
  showArrow?: boolean;
}

function TooltipContent({
  className,
  children,
  variant,
  sideOffset = 8,
  showArrow = true,
  align,
  alignOffset = 0,
  side,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        data-slot="tooltip-positioner"
        sideOffset={sideOffset}
        side={side}
        align={align}
        alignOffset={alignOffset}
        className="z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(tooltipVariants({ variant }), className)}
          {...props}
        >
          {children}
          {showArrow && <TooltipArrow variant={variant} />}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

const tooltipArrowBackgroundVariants = cva('', {
  variants: {
    variant: {
      default: 'fill-zinc-950 dark:fill-zinc-300',
      light: 'fill-background',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const tooltipArrowStrokeVariants = cva('', {
  variants: {
    variant: {
      default: '',
      light: 'stroke-background stroke-border',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface TooltipArrowProps
  extends React.ComponentProps<typeof TooltipPrimitive.Arrow>,
    VariantProps<typeof tooltipArrowBackgroundVariants> {}

function TooltipArrow({ className, variant, ...props }: TooltipArrowProps) {
  return (
    <TooltipPrimitive.Arrow
      data-slot="tooltip-arrow"
      className={cn(
        'z-50 data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180',
        className,
      )}
      {...props}
    >
      <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
        <path
          d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V9H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
          className={cn(tooltipArrowBackgroundVariants({ variant }))}
        />
        <path
          d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
          className={cn(tooltipArrowStrokeVariants({ variant }))}
        />
      </svg>
    </TooltipPrimitive.Arrow>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipArrow, tooltipVariants };
