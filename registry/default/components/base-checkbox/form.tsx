'use client';

import { Button } from '@/registry/default/ui/base-button';
import { Checkbox } from '@/registry/default/ui/base-checkbox';
import { Form } from '@/registry/default/ui/base-form';
import { Field, FieldLabel, FieldDescription, FieldError } from '@/registry/default/ui/base-field';
import { z } from 'zod';
import { useState } from 'react';

export default function Component() {
  const [errors, setErrors] = useState({});

  const schema = z.object({
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions.',
    }),
  });

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  
    const formData = new FormData(event.currentTarget);
    const result = schema.safeParse(Object.fromEntries(formData as never));
  
    if (!result.success) {
      return {
        errors: result.error.flatten().fieldErrors,
      };
    }
  
    return {
      errors: {},
    };
  }

  return (
    <Form
      className="w-[300px] space-y-6"
      errors={errors}
      onClearErrors={setErrors}
      onSubmit={async (event) => {
        const response = await submitForm(event);
        setErrors(response.errors);
      }}
    >
      <Field name="acceptTerms">
        <div className="flex items-center space-x-2">
          <Checkbox />
          <FieldLabel>I accept the terms and conditions</FieldLabel>
        </div>
        <FieldDescription>You need to agree to proceed.</FieldDescription>
        <FieldError />
      </Field>
      <div className="flex items-center justify-end gap-2.5">
        <Button type="reset" variant="outline">
          Reset
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </Form>
  );
} 