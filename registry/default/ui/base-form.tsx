import { cn } from '@/registry/default/lib/utils';
import { Form as BaseForm } from '@base-ui-components/react/form';

function Form({ className, ...props }: React.ComponentProps<typeof BaseForm>) {
  return <BaseForm data-slot="form" className={cn('flex w-full flex-col gap-4', className)} {...props} />;
}

export { Form };
