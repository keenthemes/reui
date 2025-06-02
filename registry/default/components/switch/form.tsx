'use client';

import { Alert, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { Button } from '@/registry/default/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/registry/default/ui/form';
import { Switch } from '@/registry/default/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function SwitchForm() {
  // Define form validation schema using zod
  const FormSchema = z.object({
    autoUpdate: z.boolean().refine((val) => val === true, {
      message: 'You must enable auto-update to proceed.',
    }),
  });

  // Initialize form with react-hook-form and zod
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { autoUpdate: false },
  });

  // Handle form submission
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.custom((t) => (
      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
        <AlertIcon>
          <RiCheckboxCircleFill />
        </AlertIcon>
        <AlertTitle>Auto-update is {data.autoUpdate ? 'enabled' : 'disabled'}.</AlertTitle>
      </Alert>
    ));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[300px] space-y-6">
        {/* Switch Field */}
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

        {/* Submit and Reset Buttons */}
        <div className="flex items-center justify-end gap-2.5">
          <Button type="reset" variant="outline" onClick={() => form.reset({ autoUpdate: false })}>
            Reset
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
