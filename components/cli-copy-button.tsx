'use client';

import { useCopyToClipboard } from '@/registry/default/hooks/use-copy-to-clipboard';
import { cn } from '@/registry/default/lib/utils';
import { Button } from '@/registry/default/ui/button';
import { Check, Copy } from 'lucide-react';

const CliCopyButton = ({
  componentSource,
  className,
}: {
  componentSource: string | null;
  className?: string;
}) => {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className={cn('dark absolute top-2 right-2', className)}>
      <Button
        variant="ghost"
        mode="icon"
        className="text-muted-foreground hover:text-foreground transition-none hover:bg-transparent disabled:opacity-100"
        onClick={() => copy(componentSource || '')}
        aria-label={copied ? 'Copied' : 'Copy component source'}
        disabled={copied}
      >
        {copied ? (
          <Check className="size-4 text-white" />
        ) : (
          <Copy className="size-4" />
        )}
      </Button>
    </div>
  );
};

export default CliCopyButton;
