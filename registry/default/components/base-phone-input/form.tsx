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
import { PhoneInput } from '@/registry/default/ui/base-phone-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';

export default function Component() {
  const schema = z.object({
    phoneNumber: z.string().refine(isValidPhoneNumber, {
      message: 'Please enter a valid phone number.',
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { phoneNumber: '' },
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
          name="phoneNumber"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneInput
                  {...field}
                  placeholder="Enter phone number"
                  popupClassName="w-[300px]"
                  scrollAreaClassName="h-[300px]"
                  aria-invalid={!!fieldState.error}
                />
              </FormControl>
              <FormDescription>Enter your phone number to proceed</FormDescription>
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
