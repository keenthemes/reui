'use client';

import * as React from 'react';
import { cn } from '@/registry/default/lib/utils';
import { Alert, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { Button, ButtonArrow } from '@/registry/default/ui/button';
import {
  Command,
  CommandCheck,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/registry/default/ui/command';
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/registry/default/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/default/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const topCities = [
  { value: 'amsterdam', label: 'Amsterdam, Netherlands' },
  { value: 'london', label: 'London, UK' },
  { value: 'paris', label: 'Paris, France' },
  { value: 'tokyo', label: 'Tokyo, Japan' },
  { value: 'new_york', label: 'New York, USA' },
  { value: 'dubai', label: 'Dubai, UAE' },
];

const FormSchema = z.object({
  city: z.string().refine((value) => topCities.some((city) => city.value === value), { message: 'City is required.' }),
});

export default function ComboboxForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [open, setOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>('');

  function onSubmit() {
    toast.custom((t) => (
      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
        <AlertIcon>
          <RiCheckboxCircleFill />
        </AlertIcon>
        <AlertTitle>Your form with &quot;{value}&quot; has successfully submitted</AlertTitle>
      </Alert>
    ));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[300px] space-y-6">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    mode="input"
                    placeholder={!field.value}
                    aria-expanded={open}
                    className="w-full"
                  >
                    <span className={cn('truncate')}>
                      {field.value ? topCities.find((city) => city.value === field.value)?.label : 'Select a city...'}
                    </span>
                    <ButtonArrow />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
                  <Command>
                    <CommandInput placeholder="Search city..." />
                    <CommandList>
                      <CommandEmpty>No city found.</CommandEmpty>
                      <CommandGroup>
                        {topCities.map((city) => (
                          <CommandItem
                            key={city.value}
                            value={city.value}
                            onSelect={() => {
                              setValue(city.value);
                              field.onChange(city.value);
                              setOpen(false);
                            }}
                          >
                            <span className="truncate">{city.label}</span>
                            {field.value === city.value && <CommandCheck />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>Select your preferred city.</FormDescription>
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
