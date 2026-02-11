// Description: Field with radio groups and checkboxes
// Order: 4

import { Checkbox } from "@/registry/bases/base/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/registry/bases/base/ui/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/bases/base/ui/radio-group"

export default function Pattern() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <FieldGroup>
        <FieldSet>
          <FieldLegend variant="label">Email Notifications</FieldLegend>
          <FieldGroup className="gap-4">
            <Field orientation="horizontal">
              <Checkbox id="notify-updates" defaultChecked />
              <FieldContent>
                <FieldTitle>Product updates</FieldTitle>
                <FieldDescription>
                  Receive emails about new features and improvements.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="notify-security" defaultChecked disabled />
              <FieldContent>
                <FieldTitle>Security alerts</FieldTitle>
                <FieldDescription>
                  Critical security notifications cannot be disabled.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSet>
          <FieldLegend variant="label">Profile Privacy</FieldLegend>
          <RadioGroup defaultValue="public">
            <FieldGroup className="gap-2">
              <Field orientation="horizontal">
                <RadioGroupItem value="public" id="privacy-public" />
                <FieldLabel htmlFor="privacy-public" className="font-normal">
                  Public - visible to everyone
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="private" id="privacy-private" />
                <FieldLabel htmlFor="privacy-private" className="font-normal">
                  Private - only visible to you
                </FieldLabel>
              </Field>
            </FieldGroup>
          </RadioGroup>
        </FieldSet>
      </FieldGroup>
    </div>
  )
}
