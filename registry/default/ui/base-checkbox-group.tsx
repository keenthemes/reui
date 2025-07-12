import { cn } from '@/registry/default/lib/utils';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui-components/react/checkbox-group';

function CheckboxGroup({ className, ...props }: React.ComponentProps<typeof BaseCheckboxGroup>) {
  return (
    <BaseCheckboxGroup
      data-slot="checkbox-group"
      className={cn('flex flex-col items-start gap-1.5', className)}
      {...props}
    />
  );
}

export { CheckboxGroup };
