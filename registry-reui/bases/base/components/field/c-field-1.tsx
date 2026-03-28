// Description: Fields with input groups
// Order: 1

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/registry/bases/base/ui/input-group"

export default function Pattern() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="profile-name">
            Full Name <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="profile-name"
            placeholder="Enter your full name"
            required
          />
          <FieldDescription>
            This name will be displayed on your public profile.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="profile-username">Username</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>@</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id="profile-username" placeholder="username" />
          </InputGroup>
          <FieldDescription className="text-success">
            Username is available.
          </FieldDescription>
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor="profile-email">Email Address</FieldLabel>
          <InputGroup>
            <InputGroupInput id="profile-email" placeholder="email" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>@gmail.com</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>
            Please enter a valid email address.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  )
}
