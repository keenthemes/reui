// Description: Radio group with grid layout
// Order: 11

import { Field, FieldLabel, FieldTitle } from "@/registry/bases/base/ui/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/bases/base/ui/radio-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const items = [
  {
    title: "Payments",
    description: "Receive payments from your customers",
    value: "payments",
    icon: (
      <IconPlaceholder
        lucide="CircleDollarSignIcon"
        tabler="IconPremiumRights"
        hugeicons="DollarCircleIcon"
        phosphor="CurrencyCircleDollarIcon"
        remixicon="RiMoneyDollarCircleLine"
        aria-hidden="true"
        className="size-4"
      />
    ),
  },
  {
    title: "Invoices",
    description: "Create and send invoices to your customers",
    value: "invoices",
    icon: (
      <IconPlaceholder
        lucide="FileTextIcon"
        tabler="IconFileText"
        hugeicons="File02Icon"
        phosphor="FileTextIcon"
        remixicon="RiFileTextLine"
        aria-hidden="true"
        className="size-4"
      />
    ),
  },
  {
    title: "Billing",
    description: "Manage your billing and subscriptions",
    value: "billing",
    icon: (
      <IconPlaceholder
        lucide="CreditCardIcon"
        tabler="IconCreditCard"
        hugeicons="CreditCardIcon"
        phosphor="CreditCardIcon"
        remixicon="RiBankCardLine"
        aria-hidden="true"
        className="size-4"
      />
    ),
  },
  {
    title: "Reports",
    description: "View your reports and analytics",
    value: "reports",
    icon: (
      <IconPlaceholder
        lucide="ChartNoAxesColumnDecreasingIcon"
        tabler="IconAntennaBars5"
        hugeicons="SignalFull02Icon"
        phosphor="ChartBarIcon"
        remixicon="RiBarChart2Line"
        aria-hidden="true"
        className="size-4"
      />
    ),
  },
]

export default function Pattern() {
  return (
    <RadioGroup
      defaultValue="payments"
      className="grid w-full max-w-xs grid-cols-2 gap-4"
    >
      {items.map((item) => (
        <FieldLabel
          key={item.value}
          htmlFor={item.value}
          className="relative p-0!"
        >
          <Field orientation="horizontal">
            <div className="absolute top-3 right-3">
              <RadioGroupItem value={item.value} id={item.value} />
            </div>
            <FieldTitle className="flex flex-col items-start">
              <div className="bg-background border-border style-vega:rounded-md style-lyra:rounded-lg style-maia:rounded-xl style-nova:rounded-2xl style-mira:rounded-3xl flex shrink-0 items-center justify-center border p-2 shadow-xs shadow-black/5">
                {item.icon}
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-sm font-semibold">{item.title}</span>
                <span className="text-muted-foreground text-xs">
                  {item.description}
                </span>
              </div>
            </FieldTitle>
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  )
}
