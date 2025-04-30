'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva, VariantProps } from 'class-variance-authority';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the variants for the Checkbox using cva.
const checkboxVariants = cva(
  `
    group peer bg-background shrink-0 rounded-md border border-input ring-offset-background focus-visible:outline-none 
    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 
    aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20
    [[data-invalid=true]_&]:border-destructive/60 [[data-invalid=true]_&]:ring-destructive/10  dark:[[data-invalid=true]_&]:border-destructive dark:[[data-invalid=true]_&]:ring-destructive/20
    `,
  {
    variants: {
      variant: {
        primary:
          'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary-foreground',
        mono: 'data-[state=checked]:bg-mono data-[state=checked]:border-mono data-[state=checked]:text-mono-foreground data-[state=indeterminate]:bg-mono data-[state=indeterminate]:border-mono data-[state=indeterminate]:text-mono-foreground',
      },
      size: {
        sm: 'size-4.5 [&_svg]:size-3',
        md: 'size-5 [&_svg]:size-3.5',
        lg: 'size-5.5 [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

// Extend the Checkbox props with variant props.
export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {}

function Checkbox({ className, variant, size, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(checkboxVariants({ variant, size }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn('flex items-center justify-center text-current')}
      >
        <Check className="group-data-[state=indeterminate]:hidden" />
        <Minus className="hidden group-data-[state=indeterminate]:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
