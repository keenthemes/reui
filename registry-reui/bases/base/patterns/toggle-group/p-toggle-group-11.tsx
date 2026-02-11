// Description: Toggle group for font size
// Order: 11

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/base/ui/toggle-group"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup defaultValue={["m"]} size="sm" variant="outline">
        <ToggleGroupItem value="s">S</ToggleGroupItem>
        <ToggleGroupItem value="m">M</ToggleGroupItem>
        <ToggleGroupItem value="l">L</ToggleGroupItem>
        <ToggleGroupItem value="xl">XL</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
