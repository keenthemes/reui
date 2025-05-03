'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define input size variants
const textareaVariants = cva(
  `
    w-full bg-background border border-input bg-background text-foreground shadow-xs shadow-black/5 transition-[color,box-shadow] 
    text-foreground placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] 
    focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 [&[readonly]]:opacity-70 aria-invalid:border-destructive
    aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20
  `,
  {
    variants: {
      size: {
        sm: 'px-2.5 py-2.5 text-xs rounded-md',
        md: 'px-3 py-3 text-[0.8125rem] leading-(--text-sm--line-height) rounded-md',
        lg: 'px-4 py-4 text-sm rounded-md',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {}

function Textarea({ className, size, ...props }: TextAreaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ size }), className)}
      {...props}
    />
  );
}

export { Textarea, textareaVariants };
