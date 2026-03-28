// Description: Settings form with validation
// Order: 7

import { Button } from "@/registry/bases/base/ui/button"
import { Checkbox } from "@/registry/bases/base/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldTitle,
} from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"
import { Switch } from "@/registry/bases/base/ui/switch"
import { Textarea } from "@/registry/bases/base/ui/textarea"

export default function Pattern() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="settings-name">
            Display Name <span className="text-destructive">*</span>
          </FieldLabel>
          <Input id="settings-name" defaultValue="Alex Johnson" />
          <FieldDescription>This is your public display name.</FieldDescription>
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor="settings-slug">URL Slug</FieldLabel>
          <Input id="settings-slug" defaultValue="alex johnson" />
          <FieldError>
            Slug can only contain lowercase letters, numbers, and hyphens.
          </FieldError>
        </Field>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="settings-bio">Bio</FieldLabel>
            <span className="text-muted-foreground text-xs">24/160</span>
          </div>
          <Textarea
            id="settings-bio"
            defaultValue="Software engineer & open source contributor."
            className="min-h-[80px]"
          />
          <FieldDescription>
            Brief description for your profile.
          </FieldDescription>
        </Field>
        <FieldSeparator />
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Email Notifications</FieldTitle>
            <FieldDescription>
              Receive emails about account activity.
            </FieldDescription>
          </FieldContent>
          <Switch id="settings-email-notif" defaultChecked />
        </Field>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Marketing Emails</FieldTitle>
            <FieldDescription>
              Receive emails about new features and tips.
            </FieldDescription>
          </FieldContent>
          <Switch id="settings-marketing" />
        </Field>
        <FieldSeparator />
        <Field orientation="horizontal">
          <Checkbox id="settings-terms" />
          <FieldContent>
            <FieldTitle>Terms of Service</FieldTitle>
            <FieldDescription>
              I agree to the <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </FieldDescription>
          </FieldContent>
        </Field>
        <Button className="w-full">Save Changes</Button>
      </FieldGroup>
    </div>
  )
}
