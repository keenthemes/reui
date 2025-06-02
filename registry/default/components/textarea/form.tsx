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
import { Textarea } from '@/registry/default/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function TextareaDemo() {
  // Validation schema
  const FormSchema = z.object({
    message: z
      .string()
      .min(10, 'Message must be at least 10 characters long.')
      .max(500, 'Message cannot exceed 500 characters.'),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { message: '' },
  });

  function onSubmit() {
    toast.custom((t) => (
      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
        <AlertIcon>
          <RiCheckboxCircleFill />
        </AlertIcon>
        <AlertTitle>Your message has been successfully submitted!</AlertTitle>
      </Alert>
    ));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
        {/* Textarea Field */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Type your message here..." {...field} />
              </FormControl>
              <FormDescription>Share your thoughts or feedback between 10 to 500 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit and Reset Buttons */}
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
