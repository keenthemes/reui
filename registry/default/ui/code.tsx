import * as React from 'react';
import { useCopyToClipboard } from '@/registry/default/hooks/use-copy-to-clipboard';
import { cn } from '@/registry/default/lib/utils';
import { Button } from '@/registry/default/ui/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, Copy } from 'lucide-react';
import { Slot as SlotPrimitive } from 'radix-ui';

export interface CodeProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof codeVariants> {
  asChild?: boolean;
  showCopyButton?: boolean;
  copyText?: string;
}

const codeVariants = cva('relative rounded-md bg-muted font-mono text-sm font-medium', {
  variants: {
    variant: {
      default: 'bg-muted text-muted-foreground',
      destructive: 'bg-destructive/10 text-destructive',
      outline: 'border border-border bg-background text-foreground',
    },
    size: {
      default: 'text-sm px-2.5 py-1.5',
      sm: 'text-xs px-2 py-1.5',
      lg: 'text-base px-3 py-1.5',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

function Code({
  className,
  variant,
  size,
  asChild = false,
  showCopyButton = false,
  copyText,
  children,
  ...props
}: CodeProps) {
  const { copy, copied } = useCopyToClipboard();
  const Comp = asChild ? SlotPrimitive.Slot : 'code';
  const textToCopy = copyText || (typeof children === 'string' ? children : '');

  return (
    <span className={cn('inline-flex items-center gap-2', className)} data-slot="code">
      <Comp data-slot="code-panel" className={cn(codeVariants({ variant, size }))} {...props}>
        {children}
      </Comp>
      {showCopyButton && textToCopy && (
        <Button
          mode="icon"
          size="sm"
          variant="ghost"
          className="h-4 w-4 p-0 opacity-60 hover:opacity-100"
          onClick={() => copy(textToCopy)}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      )}
    </span>
  );
}

export { Code, codeVariants };
