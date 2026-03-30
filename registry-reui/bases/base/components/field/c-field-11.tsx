// Description: Form with validation errors
// Order: 11

import { Button } from "@/registry/bases/base/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/bases/base/ui/input-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <FieldGroup>
        <Field data-invalid>
          <FieldLabel htmlFor="val-email">
            Email <span className="text-destructive">*</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <IconPlaceholder
                lucide="MailIcon"
                tabler="IconMail"
                hugeicons="MailIcon"
                phosphor="EnvelopeIcon"
                remixicon="RiMailLine"
                aria-hidden="true"
              />
            </InputGroupAddon>
            <InputGroupInput
              id="val-email"
              type="email"
              defaultValue="invalid-email"
              placeholder="you@example.com"
            />
          </InputGroup>
          <FieldError>Please enter a valid email address.</FieldError>
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor="val-password">
            Password <span className="text-destructive">*</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <IconPlaceholder
                lucide="LockIcon"
                tabler="IconLock"
                hugeicons="SquareLock01Icon"
                phosphor="LockSimpleIcon"
                remixicon="RiLockLine"
                aria-hidden="true"
              />
            </InputGroupAddon>
            <InputGroupInput
              id="val-password"
              type="password"
              defaultValue="short"
              placeholder="Enter password"
            />
          </InputGroup>
          <FieldError
            errors={[
              { message: "Must be at least 8 characters." },
              { message: "Must contain at least one number." },
            ]}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="val-confirm">Confirm Password</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <IconPlaceholder
                lucide="LockIcon"
                tabler="IconLock"
                hugeicons="SquareLock01Icon"
                phosphor="LockSimpleIcon"
                remixicon="RiLockLine"
                aria-hidden="true"
              />
            </InputGroupAddon>
            <InputGroupInput
              id="val-confirm"
              type="password"
              placeholder="Repeat password"
            />
          </InputGroup>
          <FieldDescription>
            Re-enter your password to confirm.
          </FieldDescription>
        </Field>
        <Button className="w-full">Create Account</Button>
      </FieldGroup>
    </div>
  )
}
