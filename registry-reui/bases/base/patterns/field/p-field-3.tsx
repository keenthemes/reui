// Description: Field with select control
// Order: 3

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/registry/bases/base/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"

export default function Pattern() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="plan-selection">Subscription Plan</FieldLabel>
          <Select defaultValue="pro">
            <SelectTrigger id="plan-selection">
              <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free - Basic features</SelectItem>
              <SelectItem value="pro">Pro - Advanced tools</SelectItem>
              <SelectItem value="enterprise">
                Enterprise - Custom solutions
              </SelectItem>
            </SelectContent>
          </Select>
          <FieldDescription>
            Choose the plan that best fits your needs.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="billing-cycle">Billing Cycle</FieldLabel>
          <Select defaultValue="yearly">
            <SelectTrigger id="billing-cycle">
              <SelectValue placeholder="Select billing cycle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly billing</SelectItem>
              <SelectItem value="yearly">Yearly billing (Save 20%)</SelectItem>
            </SelectContent>
          </Select>
          <FieldDescription>
            Billing cycles can be changed at any time.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  )
}
