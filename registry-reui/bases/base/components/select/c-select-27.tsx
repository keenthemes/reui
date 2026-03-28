// Description: Select with description text per option
// Order: 27

import { Field } from "@/registry/bases/base/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"

const plans = [
  {
    value: "startup",
    label: "Startup",
    description: "For small teams up to 10",
  },
  {
    value: "business",
    label: "Business",
    description: "For growing companies",
  },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "Unlimited everything",
  },
]

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <Select defaultValue={plans[0]} items={plans}>
        <SelectTrigger className="w-[240px] [&_span.text-muted-foreground]:hidden">
          <SelectValue>
            {(item: (typeof plans)[number]) => item?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            {plans.map((plan) => (
              <SelectItem
                key={plan.value}
                value={plan}
                className="[&_svg]:text-primary"
              >
                <div className="flex flex-col items-start gap-px">
                  <span className="font-medium">{plan.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {plan.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
