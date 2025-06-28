import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot as SlotPrimitive } from 'radix-ui';
import { useCopyToClipboard } from '@/registry/default/hooks/use-copy-to-clipboard';
import { Button } from '@/registry/default/ui/button';
import { Check, Copy } from 'lucide-react';

export interface CodeProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof codeVariants> {
    asChild?: boolean;
    showCopyButton?: boolean;
    copyText?: string;
}

const codeVariants = cva(
    'relative rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
    {
        variants: {
            variant: {
                default: 'bg-muted text-muted-foreground',
                destructive: 'bg-destructive/10 text-destructive',
                outline: 'border border-border bg-background text-foreground',
            },
            size: {
                default: 'text-sm',
                sm: 'text-xs',
                lg: 'text-base',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

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
        <span className="relative inline-flex items-center">
            <Comp
                data-slot="code"
                className={cn(codeVariants({ variant, size }), className)}
                {...props}
            >
                {children}
            </Comp>
            {showCopyButton && textToCopy && (
                <Button
                    mode="icon"
                    size="sm"
                    variant="ghost"
                    className="ml-1 h-4 w-4 p-0 opacity-60 hover:opacity-100"
                    onClick={() => copy(textToCopy)}
                >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
            )}
        </span>
    );
}

export { Code, codeVariants }; 