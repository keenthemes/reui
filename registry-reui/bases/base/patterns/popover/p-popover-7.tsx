// Description: Popover with custom content
// Order: 7

import { Button } from "@/registry/bases/base/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/base/ui/popover"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex min-h-[100px] items-center justify-center">
      <Popover>
        <PopoverTrigger
          render={
            <Button variant="outline" className="gap-2">
              <IconPlaceholder
                lucide="SparklesIcon"
                tabler="IconSparkles"
                hugeicons="SparklesIcon"
                phosphor="SparkleIcon"
                remixicon="RiSparklingLine"
              />
              AI Assistant
            </Button>
          }
        />
        <PopoverContent
          className="w-80 gap-0 overflow-hidden p-0"
          align="center"
        >
          <div className="bg-primary/5 border-primary/10 border-b p-2">
            <div className="text-primary flex items-center gap-2 font-semibold">
              <IconPlaceholder
                lucide="SparklesIcon"
                tabler="IconSparkles"
                hugeicons="SparklesIcon"
                phosphor="SparkleIcon"
                remixicon="RiSparklingLine"
                className="size-4"
              />
              <span>Smart Suggestions</span>
            </div>
          </div>
          <div className="space-y-3 p-2">
            <p className="text-muted-foreground leading-relaxed">
              Our AI analyzes your workflow to provide tailored recommendations.
              It helps you automate repetitive tasks and optimizes your design
              process in real-time.
            </p>
            <div className="grid grid-cols-2 items-center gap-2">
              <Button size="sm">Enable AI</Button>
              <Button size="sm" variant="outline">
                Learn more
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
