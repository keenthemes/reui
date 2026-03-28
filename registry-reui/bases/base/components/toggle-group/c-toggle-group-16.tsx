// Description: Toggle group for pricing tier
// Order: 16

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/base/ui/toggle-group"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup defaultValue={["monthly"]} variant="outline" size="lg">
        <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
        <ToggleGroupItem value="yearly" className="gap-2">
          Yearly
          <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
            Save 20%
          </span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
