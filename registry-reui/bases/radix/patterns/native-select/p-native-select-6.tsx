// Description: Invalid native select.
// Order: 6

import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/radix/ui/native-select"

export default function Pattern() {
  return (
    <NativeSelect aria-invalid="true" className="w-full max-w-xs">
      <NativeSelectOption value="">Invalid Select</NativeSelectOption>
      <NativeSelectOption value="1">Option 1</NativeSelectOption>
    </NativeSelect>
  )
}
