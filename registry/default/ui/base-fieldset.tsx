import { cn } from '@/registry/default/lib/utils';
import { Fieldset as BaseFieldset } from '@base-ui-components/react/fieldset';

function Fieldset({ className, ...props }: React.ComponentProps<typeof BaseFieldset.Root>) {
  return <BaseFieldset.Root data-slot="fieldset" className={cn('flex w-full flex-col gap-4', className)} {...props} />;
}

function FieldsetLegend({ className, ...props }: React.ComponentProps<typeof BaseFieldset.Legend>) {
  return (
    <BaseFieldset.Legend
      data-slot="fieldset-legend"
      className={cn('text-sm font-medium text-foreground', className)}
      {...props}
    />
  );
}

export { Fieldset, FieldsetLegend };
