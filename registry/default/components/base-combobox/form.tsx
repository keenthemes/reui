'use client';

import { Alert, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { Button } from '@/registry/default/ui/base-button';
import {
  Combobox,
  ComboboxClear,
  ComboboxContent,
  ComboboxControl,
  ComboboxEmpty,
  ComboboxIcon,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxValue,
} from '@/registry/default/ui/base-combobox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/registry/default/ui/base-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function ComboboxForm() {
  const FormSchema = z.object({
    fruit: z.string().min(1, 'Please select a fruit.'),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { fruit: '' },
    mode: 'onSubmit',
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.custom((t) => (
      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
        <AlertIcon>
          <RiCheckboxCircleFill />
        </AlertIcon>
        <AlertTitle>Your form with &quot;{data.fruit}&quot; has successfully submitted</AlertTitle>
      </Alert>
    ));

    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[300px] space-y-6">
        <FormField
          control={form.control}
          name="fruit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fruit</FormLabel>
              <FormControl>
                <Combobox
                  items={fruits}
                  value={field.value}
                  onValueChange={field.onChange}
                  itemToStringValue={(item: unknown) => item as string}
                >
                  <ComboboxControl>
                    <ComboboxValue>
                      <ComboboxInput
                        placeholder="e.g. Apple"
                        aria-invalid={!!form.formState.errors.fruit}
                        aria-describedby={form.formState.errors.fruit ? `${field.name}-error` : undefined}
                      />
                    </ComboboxValue>
                    {field.value && <ComboboxClear />}
                    <ComboboxIcon />
                  </ComboboxControl>

                  <ComboboxContent>
                    <ComboboxEmpty>No fruits found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item: string) => (
                        <ComboboxItem key={item} value={item}>
                          <ComboboxItemIndicator />
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </FormControl>
              <FormDescription>Select your favorite fruit</FormDescription>
              <FormMessage id={`${field.name}-error`} />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end gap-2.5">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}

const fruits = [
  'Apple',
  'Banana',
  'Orange',
  'Pineapple',
  'Grape',
  'Mango',
  'Strawberry',
  'Blueberry',
  'Raspberry',
  'Blackberry',
  'Cherry',
  'Peach',
  'Pear',
  'Plum',
  'Kiwi',
  'Watermelon',
  'Cantaloupe',
  'Honeydew',
  'Papaya',
  'Guava',
  'Lychee',
  'Pomegranate',
  'Apricot',
  'Grapefruit',
  'Passionfruit',
];
