import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { Checkbox as BaseCheckbox } from '@base-ui-components/react/checkbox';
import { cva, VariantProps } from 'class-variance-authority';
import { Check, Minus } from 'lucide-react';

// Define the variants for the Checkbox using cva.
const checkboxVariants = cva(
  `
    group peer bg-background shrink-0 rounded-md border border-input ring-offset-background focus-visible:outline-none 
    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 
    aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20
    [[data-invalid=true]_&]:border-destructive/60 [[data-invalid=true]_&]:ring-destructive/10  dark:[[data-invalid=true]_&]:border-destructive dark:[[data-invalid=true]_&]:ring-destructive/20
    data-[checked]:bg-primary data-[checked]:border-primary data-[checked]:text-primary-foreground data-[indeterminate]:bg-primary data-[indeterminate]:border-primary data-[indeterminate]:text-primary-foreground
    `,
  {
    variants: {
      size: {
        sm: 'size-4.5 [&_svg]:size-3',
        md: 'size-5 [&_svg]:size-3.5',
        lg: 'size-5.5 [&_svg]:size-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

function Checkbox({
  className,
  size,
  ...props
}: React.ComponentProps<typeof BaseCheckbox.Root> & VariantProps<typeof checkboxVariants>) {
  return (
    <BaseCheckbox.Root data-slot="checkbox" className={cn(checkboxVariants({ size }), className)} {...props}>
      <BaseCheckbox.Indicator className={cn('flex items-center justify-center text-current')}>
        <Check className="data-[indeterminate]:hidden" />
        <Minus className="hidden data-[indeterminate]:block" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}

export { Checkbox, checkboxVariants };
