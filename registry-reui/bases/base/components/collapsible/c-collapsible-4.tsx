// Description: Collapsible card with bottom trigger
// Order: 4

import { Button } from "@/registry/bases/base/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/bases/base/ui/collapsible"
import { Progress } from "@/registry/bases/base/ui/progress"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="h-72 w-full max-w-xs">
      <Collapsible className="relative">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-sm">3 days remaining in cycle</CardTitle>
            <CardAction>
              <Button variant="outline" size="sm">
                Billing
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/60 border-border style-vega:rounded-lg style-nova:rounded-lg style-lyra:rounded-none style-maia:rounded-2xl style-mira:rounded-md space-y-2 border p-3">
              <div className="flex justify-between text-sm font-medium">
                <span>$18.08 / $20</span>
                <span>$200</span>
              </div>
              <Progress
                value={90}
                className="**:data-[slot=progress-track]:bg-primary/20 **:data-[slot=progress-track]:h-1.5"
              />
            </div>

            <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
              <div className="flex flex-col gap-2.5 pt-2">
                {[
                  { label: "Requests", value: "$210.84" },
                  { label: "Active CPU", value: "$21.95" },
                  { label: "Events", value: "$21.20" },
                  { label: "Storage Usage", value: "$20.45" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between text-xs"
                  >
                    <span className="text-muted-foreground font-medium">
                      {item.label}
                    </span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </CardContent>
        </Card>

        <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2">
          <CollapsibleTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                className="bg-background! rounded-full shadow-sm"
              />
            }
          >
            <IconPlaceholder
              lucide="ChevronDownIcon"
              tabler="IconChevronDown"
              hugeicons="ArrowDown01Icon"
              phosphor="CaretDownIcon"
              remixicon="RiArrowDownSLine"
              aria-hidden="true"
              className="size-3.5 transition-transform in-data-panel-open:rotate-180"
            />
            <span className="sr-only">Toggle details</span>
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    </div>
  )
}
