// Description: Toggle group for color theme
// Order: 10

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/base/ui/toggle-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup defaultValue={["light"]} variant="outline">
        <ToggleGroupItem value="light" aria-label="Light theme">
          <IconPlaceholder
            lucide="SunIcon"
            tabler="IconSun"
            hugeicons="Sun01Icon"
            phosphor="SunIcon"
            remixicon="RiSunLine"
          />
          Light
        </ToggleGroupItem>
        <ToggleGroupItem value="dark" aria-label="Dark theme">
          <IconPlaceholder
            lucide="MoonIcon"
            tabler="IconMoon"
            hugeicons="Moon02Icon"
            phosphor="MoonIcon"
            remixicon="RiMoonLine"
          />
          Dark
        </ToggleGroupItem>
        <ToggleGroupItem value="system" aria-label="System theme">
          <IconPlaceholder
            lucide="MonitorIcon"
            tabler="IconDeviceDesktop"
            hugeicons="ComputerIcon"
            phosphor="MonitorIcon"
            remixicon="RiComputerLine"
          />
          System
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
