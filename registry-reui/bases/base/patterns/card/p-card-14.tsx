// Description: Deployment status summary card
// Order: 14

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/registry/bases/base/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const stats = [
  { label: "Environment", value: "Production" },
  { label: "Region", value: "us-east-1" },
  { label: "Version", value: "v2.4.0" },
  { label: "Status", value: "Healthy" },
]

export default function Pattern() {
  return (
    <Card className="mx-auto w-full max-w-xs overflow-hidden p-0">
      <CardContent className="flex flex-col items-center p-0">
        {/* Header with gradient */}
        <div className="flex w-full flex-col items-center justify-center bg-linear-to-b from-fuchsia-50/80 to-transparent py-12">
          <div className="relative mb-6">
            <div className="absolute inset-0 scale-150 rounded-full bg-fuchsia-400/10 blur-2xl" />
            <IconPlaceholder
              lucide="SquareTerminalIcon"
              tabler="IconTerminal2"
              hugeicons="ComputerTerminal01Icon"
              phosphor="TerminalWindowIcon"
              remixicon="RiTerminalBoxLine"
              aria-hidden="true"
              className="relative size-16 text-fuchsia-600"
              strokeWidth={1.5}
            />
          </div>
          <h3 className="text-foreground text-lg font-semibold">
            Deployment Successful
          </h3>
          <p className="text-muted-foreground text-sm">Your app is now live</p>
        </div>

        {/* Status Rows */}
        <div className="w-full space-y-1 px-4 pb-6">
          {stats.map((item, index) => (
            <div
              key={item.label}
              className={cn(
                "style-vega:rounded-lg style-nova:rounded-lg style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md flex items-center justify-between px-3 py-2.5",
                index % 2 === 0 && "bg-muted/40"
              )}
            >
              <span className="text-foreground text-sm font-medium">
                {item.label}
              </span>
              <span className="text-muted-foreground text-sm">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
