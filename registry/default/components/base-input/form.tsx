'use client';

import { Alert, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { Button } from '@/registry/default/ui/base-button';
import { Form } from '@/registry/default/ui/base-form';
import { Field, FieldLabel, FieldDescription, FieldError } from '@/registry/default/ui/base-field';
import { Input } from '@/registry/default/ui/base-input';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useState } from 'react';

const FormSchema = z.object({
  email: z.string().min(1, 'Email is required').email({ message: 'Please enter a valid email address.' }),
});

export default function InputDemo() {
  const [errors, setErrors] = useState({});

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  
    const formData = new FormData(event.currentTarget);
    const result = FormSchema.safeParse(Object.fromEntries(formData as never));
  
    if (!result.success) {
      return {
        errors: result.error.flatten().fieldErrors,
      };
    }

    // Show success toast
    toast.custom((t) => (
      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
        <AlertIcon>
          <RiCheckboxCircleFill />
        </AlertIcon>
        <AlertTitle>Your form has been successfully submitted</AlertTitle>
      </Alert>
    ));
  
    return {
      errors: {},
    };
  }

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    form.reset();
    setErrors({});
  };

  return (
    <Form
      className="w-80 space-y-6"
      errors={errors}
      onClearErrors={setErrors}
      onSubmit={async (event) => {
        const response = await submitForm(event);
        setErrors(response.errors);
      }}
      onReset={handleReset}
    >
      <Field name="email">
        <FieldLabel>Email address:</FieldLabel>
        <Input placeholder="Email address" />
        <FieldDescription>Enter your email to proceed</FieldDescription>
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
