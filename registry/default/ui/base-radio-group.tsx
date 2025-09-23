'use client';

import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { Radio as RadioPrimitive } from '@base-ui-components/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui-components/react/radio-group';
import { cva, VariantProps } from 'class-variance-authority';
import { CircleIcon } from 'lucide-react';

type RadioSize = 'sm' | 'md' | 'lg';

// Define variants for the RadioGroupItem using cva.
const radioItemVariants = cva(
  `
    peer border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 
    dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square shrink-0 
    rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50
    disabled:[&+[data-slot=label]]:opacity-50
  `,
  {
    variants: {
      size: {
        sm: 'size-3 [&_svg]:size-1.5',
        md: 'size-4 [&_svg]:size-2',
        lg: 'size-5 [&_svg]:size-2.5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

// Create a context to pass the size down to items.
const RadioGroupContext = React.createContext<{
  size: RadioSize;
}>({ size: 'md' });

function RadioGroup({
  className,
  size = 'md',
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive> & { size?: RadioSize }) {
  return (
    <RadioGroupContext.Provider value={{ size }}>
      <RadioGroupPrimitive data-slot="radio-group" className={cn('grid gap-3', className)} {...props} />
    </RadioGroupContext.Provider>
  );
}

function RadioGroupItem({
  className,
  size,
  ...props
}: React.ComponentProps<typeof RadioPrimitive.Root> & VariantProps<typeof radioItemVariants>) {
  // Use the size from context if not provided at the item level.
  const { size: contextSize } = React.useContext(RadioGroupContext);
  const effectiveSize = size ?? contextSize;

  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(radioItemVariants({ size: effectiveSize }), className)}
      {...props}
    >
      <RadioPrimitive.Indicator data-slot="radio-group-indicator" className="relative flex items-center justify-center">
        <CircleIcon className="fill-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, RadioGroupItem };
