import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { Progress as BaseProgress } from '@base-ui-components/react/progress';

function Progress({ className, children, ...props }: React.ComponentProps<typeof BaseProgress.Root>) {
  return (
    <BaseProgress.Root data-slot="progress" className="relative" {...props}>
      <BaseProgress.Track
        data-slot="progress-track"
        className={cn('bg-secondary block h-1.5 w-full overflow-hidden rounded-full', className)}
      >
        <BaseProgress.Indicator
          data-slot="progress-indicator"
          className="bg-primary block h-full w-full transition-all"
        />
      </BaseProgress.Track>
      {children}
    </BaseProgress.Root>
  );
}

function ProgressValue({ className, ...props }: React.ComponentProps<typeof BaseProgress.Value>) {
  return (
    <BaseProgress.Value
      data-slot="progress-value"
      className={cn('text-foreground mt-1.5 flex justify-end text-sm font-medium', className)}
      {...props}
    />
  );
}

export { Progress, ProgressValue };
