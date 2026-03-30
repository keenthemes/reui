// Description: Vertical toggle group for settings
// Order: 9

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/base/ui/toggle-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup
        multiple
        orientation="vertical"
        spacing={1}
        defaultValue={["wifi", "bluetooth"]}
      >
        <ToggleGroupItem value="wifi" aria-label="Wi-Fi" className="w-full">
          <IconPlaceholder
            lucide="WifiIcon"
            tabler="IconWifi"
            hugeicons="Wifi01Icon"
            phosphor="WifiHighIcon"
            remixicon="RiWifiLine"
          />
          Wi-Fi
        </ToggleGroupItem>
        <ToggleGroupItem
          value="bluetooth"
          aria-label="Bluetooth"
          className="w-full"
        >
          <IconPlaceholder
            lucide="BluetoothIcon"
            tabler="IconBluetooth"
            hugeicons="BluetoothIcon"
            phosphor="BluetoothIcon"
            remixicon="RiBluetoothLine"
          />
          Bluetooth
        </ToggleGroupItem>
        <ToggleGroupItem
          value="airplane"
          aria-label="Airplane Mode"
          className="w-full"
        >
          <IconPlaceholder
            lucide="PlaneIcon"
            tabler="IconPlane"
            hugeicons="AirplaneModeIcon"
            phosphor="AirplaneTiltIcon"
            remixicon="RiFlightTakeoffLine"
          />
          Airplane Mode
        </ToggleGroupItem>
        <ToggleGroupItem
          value="location"
          aria-label="Location"
          className="w-full"
        >
          <IconPlaceholder
            lucide="MapPinIcon"
            tabler="IconMapPin"
            hugeicons="Location06Icon"
            phosphor="MapPinIcon"
            remixicon="RiMapPinLine"
          />
          Location
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
