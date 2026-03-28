// Description: Select component with a subscription plan style
// Order: 6

import { Field } from "@/registry/bases/base/ui/field"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/registry/bases/base/ui/item"
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
    name: "Starter",
    description: "Perfect for individuals getting started.",
  },
  {
    name: "Professional",
    description: "Ideal for growing teams and businesses.",
  },
  {
    name: "Enterprise",
    description: "Advanced features for large organizations.",
  },
]

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <Select
        items={plans.map((plan) => ({
          label: plan.name,
          value: plan,
        }))}
        defaultValue={plans[0]}
        itemToStringValue={(plan: (typeof plans)[number]) => plan.name}
      >
        <SelectTrigger className="h-auto! w-full">
          <SelectValue>
            {(value: (typeof plans)[number]) => <SelectPlanItem plan={value} />}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            {plans.map((plan) => (
              <SelectItem key={plan.name} value={plan}>
                <SelectPlanItem plan={plan} />
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

function SelectPlanItem({ plan }: { plan: (typeof plans)[number] }) {
  return (
    <Item size="xs" className="w-full p-0">
      <ItemContent className="gap-0">
        <ItemTitle>{plan.name}</ItemTitle>
        <ItemDescription className="text-xs">
          {plan.description}
        </ItemDescription>
      </ItemContent>
    </Item>
  )
}
