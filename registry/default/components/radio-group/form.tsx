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
import { RadioGroup, RadioGroupItem } from '@/registry/default/ui/radio-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function RadioGroupForm() {
  // Define schema for form validation
  const FormSchema = z.object({
    selectedOption: z.string().nonempty({
      message: 'You must select an option.',
    }),
  });

  // Initialize react-hook-form with zod schema
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { selectedOption: '' },
  });

  // Form submission handler
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.custom((t) => (
      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
        <AlertIcon>
          <RiCheckboxCircleFill />
        </AlertIcon>
        <AlertTitle>Selected Option: {data.selectedOption}</AlertTitle>
      </Alert>
    ));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[300px] space-y-6">
        <FormField
          control={form.control}
          name="selectedOption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select an option</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} value={field.value}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="default-option" />
                    <FormLabel htmlFor="default-option" className="font-normal">
                      Default
                    </FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="intermediate-option" />
                    <FormLabel htmlFor="intermediate-option" className="font-normal">
                      Intermediate
                    </FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="advanced-option" />
                    <FormLabel htmlFor="advanced-option" className="font-normal">
                      Advanced
                    </FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription>Please select one of the options to proceed.</FormDescription>
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
