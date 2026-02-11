// Description: Accordion with disabled items and highlighted state
// Order: 5

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/bases/base/ui/accordion"

const items = [
  {
    value: "item-1",
    trigger: "Can I access my account history?",
    content:
      "Yes, you can view your complete account history including all transactions, plan changes, and support tickets in the Account History section of your dashboard.",
    disabled: false,
  },
  {
    value: "item-2",
    trigger: "Premium feature information (Locked)",
    content:
      "This section contains information about premium features. Upgrade your plan to access this content.",
    disabled: true,
  },
  {
    value: "item-3",
    trigger: "How do I update my email address?",
    content:
      "You can update your email address in your account settings. You'll receive a verification email at your new address to confirm the change.",
    disabled: false,
  },
]

export default function Pattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Accordion
        multiple={false}
        defaultValue={["item-1"]}
        className="border-border style-vega:rounded-lg style-nova:rounded-lg style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md overflow-hidden border"
      >
        {items.map((item) => (
          <AccordionItem
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className="data-open:bg-muted/50 **:data-[slot=accordion-content]:p-0!"
          >
            <AccordionTrigger className="px-4 py-4 hover:no-underline">
              {item.trigger}
            </AccordionTrigger>
            <AccordionContent className="px-4! pt-0 pb-4">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
