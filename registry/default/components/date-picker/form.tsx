'use client';

import * as React from 'react';
import { Alert, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { Button } from '@/registry/default/ui/button';
import { Calendar } from '@/registry/default/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/registry/default/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/default/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Define the schema with Zod
const FormSchema = z.object({
  singleDate: z
    .string()
    .nonempty({ message: 'Date is required.' })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Please select a valid date.',
    }),
  rangeDate: z
    .object({
      from: z.string().optional(),
      to: z.string().optional(),
    })
    .optional()
    .refine(
      (val) =>
        !val ||
        (!val.from && !val.to) ||
        (val.from && val.to && !isNaN(Date.parse(val.from)) && !isNaN(Date.parse(val.to))),
      {
        message: 'Please select a valid date range.',
        path: ['rangeDate'],
      },
    ),
});

export default function CombinedDatePickerForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      singleDate: '',
      rangeDate: { from: '', to: '' },
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const message = [];
    if (data.singleDate) {
      message.push(`Single date: ${format(new Date(data.singleDate), 'PPP')}`);
    }
    if (data.rangeDate?.from && data.rangeDate?.to) {
      message.push(
        `Range: ${format(new Date(data.rangeDate.from), 'PPP')} - ${format(new Date(data.rangeDate.to), 'PPP')}`,
      );
    }
    const finalMessage = message.length > 0 ? message.join(' | ') : 'No dates selected';

    toast.custom((t) => (
      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
        <AlertIcon>
          <RiCheckboxCircleFill />
        </AlertIcon>
        <AlertTitle>{finalMessage}</AlertTitle>
      </Alert>
    ));
  };

  const handleReset = () => {
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[300px] space-y-6">
        <FormField
          control={form.control}
          name="singleDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Single Date:</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        mode="input"
                        placeholder={!field.value}
                        className="w-full"
                      >
                        <CalendarIcon />
                        {field.value ? format(new Date(field.value), 'dd MMM, yyyy') : <span>Pick a date</span>}
                      </Button>
                      {field.value && (
                        <Button
                          type="button"
                          variant="dim"
                          size="sm"
                          className="absolute top-1/2 -end-0 -translate-y-1/2"
                          onClick={(e) => {
                            e.preventDefault();
                            form.setValue('singleDate', '', {
                              shouldValidate: true,
                            });
                          }}
                        >
                          <X />
                        </Button>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        form.setValue('singleDate', date?.toISOString() || '', {
                          shouldValidate: true,
                        })
                      }
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormDescription>Enter your single date to proceed</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rangeDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Range:</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <Button
                        variant="outline"
                        mode="input"
                        placeholder={!field.value?.from && !field.value?.to}
                        className="w-full"
                      >
                        <CalendarIcon />
                        {field.value?.from ? (
                          field.value.to ? (
                            `${format(new Date(field.value.from), 'dd MMM, yyyy')} - ${format(new Date(field.value.to), 'dd MMM, yyyy')}`
                          ) : (
                            format(new Date(field.value.from), 'dd MMM, yyyy')
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                      {field.value?.from && (
                        <Button
                          variant="dim"
                          size="sm"
                          className="absolute top-1/2 -end-0 -translate-y-1/2"
                          onClick={(e) => {
                            e.preventDefault();
                            form.setValue('rangeDate', { from: '', to: '' }, { shouldValidate: true });
                          }}
                        >
                          <X />
                        </Button>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={
                        field.value?.from && field.value?.to
                          ? {
                              from: new Date(field.value.from),
                              to: new Date(field.value.to),
                            }
                          : undefined
                      }
                      onSelect={(range) =>
                        form.setValue(
                          'rangeDate',
                          {
                            from: range?.from?.toISOString() || '',
                            to: range?.to?.toISOString() || '',
                          },
                          { shouldValidate: true },
                        )
                      }
                      numberOfMonths={2}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormDescription>Enter your date range to proceed</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
