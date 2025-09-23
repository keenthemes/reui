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
import { RadioGroup, RadioGroupItem } from '@/registry/default/ui/base-radio-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function Component() {
  const schema = z.object({
    notification: z.string().min(1, {
      message: 'Please select a notification preference.',
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { notification: '' },
    mode: 'onSubmit',
  });

  function onSubmit(data: z.infer<typeof schema>) {
    console.log('Form submitted:', data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px] space-y-6">
        <FormField
          control={form.control}
          name="notification"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Notification Preference</FormLabel>
              <FormControl>
                <RadioGroup value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                  <FormItem className="flex items-center">
                    <FormControl>
                      <RadioGroupItem value="all" id="all" />
                    </FormControl>
                    <FormLabel htmlFor="all">All notifications</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center">
                    <FormControl>
                      <RadioGroupItem value="direct" id="direct" />
                    </FormControl>
                    <FormLabel htmlFor="direct">Direct messages and mentions</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center">
                    <FormControl>
                      <RadioGroupItem value="none" id="none" />
                    </FormControl>
                    <FormLabel htmlFor="none">Nothing</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormDescription>Choose how you want to be notified.</FormDescription>
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
