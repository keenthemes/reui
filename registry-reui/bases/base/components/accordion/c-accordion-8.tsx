// Description: Nested accordion example with bordered items
// Order: 8

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/bases/base/ui/accordion"

const nestedItems = [
  {
    value: "sub-item-1",
    trigger: "Technical Specifications",
    content:
      "Detailed technical specs including dimensions, weight, and power requirements.",
  },
  {
    value: "sub-item-2",
    trigger: "Compatibility",
    content:
      "List of supported devices and operating systems for this product.",
  },
]

const mainItems = [
  {
    value: "product-info",
    trigger: "Product Overview",
    content:
      "This product is designed for high-performance enterprise environments requiring maximum reliability.",
  },
  {
    value: "details",
    trigger: "Additional Details",
    isNested: true,
  },
  {
    value: "shipping",
    trigger: "Shipping & Returns",
    content:
      "Free standard shipping on orders over $500. 30-day return policy applies.",
  },
]

export default function Pattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Accordion
        multiple={false}
        defaultValue={["details"]}
        className="space-y-2 border-none"
      >
        {mainItems.map((item) => (
          <AccordionItem
            key={item.value}
            value={item.value}
            className="border-border style-vega:rounded-lg style-nova:rounded-lg style-lyra:rounded-none style-maia:rounded-4xl style-maia:px-0 style-mira:rounded-md border bg-transparent px-4"
          >
            <AccordionTrigger className="items-center py-3 font-medium hover:no-underline">
              {item.trigger}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground h-auto">
              {item.isNested ? (
                <Accordion
                  multiple={false}
                  defaultValue={["sub-item-1"]}
                  className="space-y-2 border-none"
                >
                  {nestedItems.map((subItem) => (
                    <AccordionItem
                      key={subItem.value}
                      value={subItem.value}
                      className="border-border style-vega:rounded-lg style-nova:rounded-lg style-lyra:rounded-none style-maia:rounded-4xl style-maia:px-0 style-mira:rounded-md border bg-transparent px-3"
                    >
                      <AccordionTrigger className="text-foreground items-center py-3 font-medium hover:no-underline">
                        {subItem.trigger}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm">
                        {subItem.content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                item.content
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
