// Description: Card with icon, title and link
// Order: 17

import { Card, CardContent } from "@/registry/bases/radix/ui/card"
import { IconPlaceholder } from "@/app/(create)/customizer/icon-placeholder"

const item = {
  title: "Recent Orders Overview",
  description:
    "Track and review all recent purchases, updates, and status changes in one place.",
  link: "View Orders",
  icon: (
    <IconPlaceholder
      lucide="ShoppingBagIcon"
      tabler="IconShoppingBag"
      hugeicons="ShoppingBag01Icon"
      phosphor="ShoppingBagOpenIcon"
      remixicon="RiShoppingBagLine"
      aria-hidden="true"
    />
  ),
}

export default function Pattern() {
  return (
    <Card className="w-full max-w-xs">
      <CardContent className="flex flex-col gap-3">
        <div className="bg-primary style-vega:rounded-lg style-maia:rounded-xl style-nova:rounded-md style-lyra:rounded-none style-mira:rounded-md [&_svg]:text-primary-foreground flex size-11 items-center justify-center [&_svg]:size-5">
          {item.icon}
        </div>
        <a
          href="#"
          className="text-foreground hover:text-primary block text-sm leading-tight font-medium"
        >
          {item.title}
        </a>
        <p className="text-muted-foreground text-xs leading-relaxed">
          {item.description}
        </p>
        <a
          href="#"
          className="text-primary inline-flex items-center gap-1 text-xs font-medium hover:underline"
        >
          {item.link}
          <IconPlaceholder
            lucide="ChevronRightIcon"
            tabler="IconChevronRight"
            hugeicons="ArrowRight01Icon"
            phosphor="CaretRightIcon"
            remixicon="RiArrowRightSLine"
            aria-hidden="true"
            className="size-2.5 shrink-0"
          />
        </a>
      </CardContent>
    </Card>
  )
}
