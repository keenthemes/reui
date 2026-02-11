// Description: Small native select.
// Order: 3

import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/base/ui/native-select"

export default function Pattern() {
  return (
    <NativeSelect size="sm" className="w-full max-w-xs">
      <NativeSelectOption value="">Small Select</NativeSelectOption>
      <NativeSelectOption value="1">Option 1</NativeSelectOption>
      <NativeSelectOption value="2">Option 2</NativeSelectOption>
    </NativeSelect>
  )
}
