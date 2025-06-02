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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/default/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function SelectForm() {
  const FormSchema = z.object({
    email: z
      .string({
        required_error: 'Please select an email.',
      })
      .email(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit() {
    toast.custom((t) => (
      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
        <AlertIcon>
          <RiCheckboxCircleFill />
        </AlertIcon>
        <AlertTitle>Your form has successfully submitted</AlertTitle>
      </Alert>
    ));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[300px] space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select email address" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m@example.com">hello@crudhunt.com</SelectItem>
                    <SelectItem value="m@google.com">support@crudhunt.com</SelectItem>
                    <SelectItem value="m@support.com">finance@crudhunt.com</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Set your primary email address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end gap-2.5">
          <Button type="reset" variant="outline">
            Reset
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
