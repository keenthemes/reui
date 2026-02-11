// Description: Responsive field layout
// Order: 9

import { Button } from "@/registry/bases/base/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"

export default function Pattern() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <FieldGroup>
        <Field orientation="responsive">
          <FieldLabel htmlFor="resp-first">First Name</FieldLabel>
          <Input id="resp-first" placeholder="First name" />
        </Field>
        <Field orientation="responsive">
          <FieldLabel htmlFor="resp-last">Last Name</FieldLabel>
          <Input id="resp-last" placeholder="Last name" />
        </Field>
        <Field orientation="responsive">
          <FieldLabel htmlFor="resp-email">Email</FieldLabel>
          <Input id="resp-email" type="email" placeholder="you@example.com" />
        </Field>
        <Field orientation="responsive">
          <FieldLabel htmlFor="resp-role">Role</FieldLabel>
          <Select defaultValue="member">
            <SelectTrigger id="resp-role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <FieldSeparator />
        <FieldDescription>
          The invited member will receive an email with a link to join.
        </FieldDescription>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Send Invite</Button>
        </div>
      </FieldGroup>
    </div>
  )
}
