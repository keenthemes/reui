// Description: Accordion with rotating arrow indicator
// Order: 10

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/bases/base/ui/accordion"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const items = [
  {
    value: "item-1",
    trigger: "Can I use this for my project?",
    content:
      "Yes, you can use ReUI for any of your personal or commercial projects. The library is distributed under the MIT license.",
  },
  {
    value: "item-2",
    trigger: "Is there a Figma file available?",
    content:
      "We are currently working on a comprehensive Figma design system that will be released soon to all ReUI users.",
  },
  {
    value: "item-3",
    trigger: "How do I contribute to ReUI?",
    content:
      "You can contribute by reporting bugs, suggesting features, or submitting pull requests on our GitHub repository.",
  },
]

export default function Pattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Accordion multiple={false} defaultValue={["item-1"]}>
        {items.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger className="flex-row-reverse items-center justify-end gap-3 py-3 hover:no-underline *:data-[slot=accordion-trigger-icon]:hidden">
              <span className="text-foreground/90 font-medium">
                {item.trigger}
              </span>
              <IconPlaceholder
                lucide="ChevronRightIcon"
                tabler="IconChevronRight"
                hugeicons="ArrowRight01Icon"
                phosphor="CaretRightIcon"
                remixicon="RiArrowRightSLine"
                className="text-muted-foreground size-4 shrink-0 transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-90"
              />
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground ps-7 leading-relaxed">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
