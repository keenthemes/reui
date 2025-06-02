'use client';

import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { Button } from '@/registry/default/ui/button';
import { VariantProps } from 'class-variance-authority';
import { Check, Copy } from 'lucide-react';
import { Event, trackEvent } from '@/lib/events';

interface CopyButtonProps {
  value: string;
  src?: string;
  className?: string;
  event?: Event['name'];
  variant?: VariantProps<typeof Button>['variant'];
}

export async function copyToClipboardWithMeta(value: string, event?: Event) {
  navigator.clipboard.writeText(value);
  if (event) {
    trackEvent(event);
  }
}

export function CopyButton({ value, className, variant = 'ghost', event, ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, [hasCopied]);

  return (
    <Button
      mode="icon"
      variant={variant}
      className={cn(
        'relative z-10 h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50 [&_svg]:h-3.5 [&_svg]:w-3.5',
        className,
      )}
      onClick={() => {
        copyToClipboardWithMeta(
          value,
          event
            ? {
                name: event,
                properties: {
                  code: value,
                },
              }
            : undefined,
        );
        setHasCopied(true);
      }}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? <Check className="size-4 text-white" /> : <Copy className="size-4" />}
    </Button>
  );
}
