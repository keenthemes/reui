'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cva, VariantProps } from 'class-variance-authority';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

type RadioVariant = 'primary' | 'mono';
type RadioSize = 'sm' | 'md' | 'lg';

// Define a cva function for the RadioGroup root.
const radioGroupVariants = cva('grid gap-2.5', {
  variants: {
    variant: {
      primary: '',
      mono: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

// Extend the RadioGroup props to include a variant.
export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    VariantProps<typeof radioGroupVariants> {}

// Create a context to pass the variant and size down to items.
const RadioGroupContext = React.createContext<{
  variant: RadioVariant;
  size: RadioSize;
}>({ variant: 'primary', size: 'md' });

function RadioGroup({ className, variant, size, ...props }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider
      value={{ variant: variant ?? 'primary', size: size ?? 'md' }}
    >
      <RadioGroupPrimitive.Root
        data-slot="radio-group"
        className={cn(radioGroupVariants({ variant, size }), className)}
        {...props}
      />
    </RadioGroupContext.Provider>
  );
}

// Define variants for the RadioGroupItem using cva.
const radioItemVariants = cva(
  `
    peer aspect-square rounded-full border outline-hidden ring-offset-background focus:outline-none focus-visible:ring-2 
    focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
    aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20
    [[data-invalid=true]_&]:border-destructive/60 [[data-invalid=true]_&]:ring-destructive/10  dark:[[data-invalid=true]_&]:border-destructive dark:[[data-invalid=true]_&]:ring-destructive/20
  `,
  {
    variants: {
      variant: {
        primary:
          'border-input text-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground',
        mono: 'border-input text-mono data-[state=checked]:bg-mono data-[state=checked]:border-mono data-[state=checked]:text-mono-foreground',
      },
      size: {
        sm: 'size-4.5 [&_svg]:size-2',
        md: 'size-5 [&_svg]:size-2.5',
        lg: 'size-5.5 [&_svg]:size-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioItemVariants> {}

function RadioGroupItem({
  className,
  variant,
  size,
  ...props
}: RadioGroupItemProps) {
  // Use the variant and size from context if not provided at the item level.
  const { variant: contextVariant, size: contextSize } =
    React.useContext(RadioGroupContext);
  const effectiveVariant = variant ?? contextVariant;
  const effectiveSize = size ?? contextSize;

  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        radioItemVariants({ variant: effectiveVariant, size: effectiveSize }),
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        <Circle className="fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
