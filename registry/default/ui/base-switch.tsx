import * as React from 'react';
import { Switch as SwitchPrimitive } from '@base-ui-components/react/switch';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define a context for `size` state
const SwitchContext = React.createContext<{ size: 'sm' | 'md' | 'lg' }>({
  size: 'md',
});

const useSwitchContext = () => {
  const context = React.useContext(SwitchContext);
  if (!context) {
    throw new Error('SwitchThumb must be used within a Switch component');
  }
  return context;
};

// Define the variants for the Switch using cva.
const switchVariants = cva(
  `
    peer data-[checked]:bg-primary data-[unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[unchecked]:bg-input/80 
    aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20
    inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] 
    disabled:cursor-not-allowed disabled:opacity-50
  `,
  {
    variants: {
      size: {
        sm: 'h-4 w-6',
        md: 'h-5 w-8',
        lg: 'h-6 w-10',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const switchThumbVariants = cva(
  'bg-background dark:data-[unchecked]:bg-foreground dark:data-[checked]:bg-primary-foreground pointer-events-none rounded-full ring-0 transition-transform flex items-center justify-center',
  {
    variants: {
      size: {
        sm: 'size-3 data-[checked]:translate-x-[calc(100%-2px)] data-[unchecked]:translate-x-0',
        md: 'size-4 data-[checked]:translate-x-[calc(100%-2px)] data-[unchecked]:translate-x-0',
        lg: 'size-5 data-[checked]:translate-x-[calc(100%-2px)] data-[unchecked]:translate-x-0',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

function Switch({
  className,
  children,
  size = 'md',
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & VariantProps<typeof switchVariants>) {
  const effectiveSize = size ?? 'md';
  return (
    <SwitchContext.Provider value={{ size: effectiveSize }}>
      <SwitchPrimitive.Root
        data-slot="switch"
        className={cn(switchVariants({ size: effectiveSize }), className)}
        {...props}
      >
        {children ?? <SwitchThumb />}
      </SwitchPrimitive.Root>
    </SwitchContext.Provider>
  );
}

function SwitchThumb({
  className,
  size,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Thumb> & Partial<VariantProps<typeof switchThumbVariants>>) {
  const context = useSwitchContext();
  const effectiveSize = size ?? context.size;

  return (
    <SwitchPrimitive.Thumb
      data-slot="switch-thumb"
      className={cn(switchThumbVariants({ size: effectiveSize }), className)}
      {...props}
    />
  );
}

export { Switch, SwitchThumb, switchVariants };
