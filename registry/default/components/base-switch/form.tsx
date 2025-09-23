'use client';

import { Button } from '@/registry/default/ui/base-button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/registry/default/ui/base-form';
import { Switch } from '@/registry/default/ui/base-switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function Component() {
  const schema = z.object({
    autoUpdate: z.boolean().refine((val) => val === true, {
      message: 'You must enable auto-update to proceed.',
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { autoUpdate: false },
    mode: 'onSubmit',
  });

  function onSubmit(data: z.infer<typeof schema>) {
    console.log('Form submitted:', data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[300px] space-y-6">
        <FormField
          control={form.control}
          name="autoUpdate"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Enable auto-update</FormLabel>
              </div>
              <FormDescription>
                You must enable auto-update to receive the latest updates automatically.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end gap-2.5">
          <Button type="reset" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
