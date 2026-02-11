// Description: Accordion with plus/minus indicators
// Order: 2

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/bases/base/ui/accordion"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const items = [
  {
    value: "security",
    trigger: "Data Security",
    content:
      "We use industry-standard AES-256 encryption to protect your sensitive information at rest and in transit.",
  },
  {
    value: "integration",
    trigger: "API Integration",
    content:
      "Seamlessly connect with your favorite tools using our robust REST API and pre-built connectors.",
  },
  {
    value: "collaboration",
    trigger: "Team Collaboration",
    content:
      "Invite team members, assign roles, and work together in real-time on shared projects and documents.",
  },
]

export default function Pattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Accordion multiple defaultValue={["security"]}>
        {items.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger className="hover:no-underline *:data-[slot=accordion-trigger-icon]:hidden">
              <span>{item.trigger}</span>
              <IconPlaceholder
                lucide="PlusIcon"
                tabler="IconPlus"
                hugeicons="PlusSignIcon"
                phosphor="PlusIcon"
                remixicon="RiAddLine"
                className="text-muted-foreground ml-auto size-3.5 shrink-0 transition-transform duration-200 group-aria-expanded/accordion-trigger:hidden"
              />
              <IconPlaceholder
                lucide="MinusIcon"
                tabler="IconMinus"
                hugeicons="MinusSignIcon"
                phosphor="MinusIcon"
                remixicon="RiSubtractLine"
                className="text-muted-foreground ml-auto hidden size-3.5 shrink-0 transition-transform duration-200 group-aria-expanded/accordion-trigger:inline"
              />
            </AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
