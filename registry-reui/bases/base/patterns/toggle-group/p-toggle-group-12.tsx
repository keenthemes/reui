// Description: Toggle group for time range filter
// Order: 12

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/base/ui/toggle-group"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup defaultValue={["24h"]} variant="outline" size="sm">
        <ToggleGroupItem value="1h">1H</ToggleGroupItem>
        <ToggleGroupItem value="6h">6H</ToggleGroupItem>
        <ToggleGroupItem value="24h">24H</ToggleGroupItem>
        <ToggleGroupItem value="7d">7D</ToggleGroupItem>
        <ToggleGroupItem value="30d">30D</ToggleGroupItem>
        <ToggleGroupItem value="all">All</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
