// Description: Basic native select.
// Order: 1

import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/base/ui/native-select"

export default function Pattern() {
  return (
    <NativeSelect className="w-full max-w-xs">
      <NativeSelectOption value="">Select a fruit</NativeSelectOption>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
      <NativeSelectOption value="grapes" disabled>
        Grapes
      </NativeSelectOption>
      <NativeSelectOption value="pineapple">Pineapple</NativeSelectOption>
    </NativeSelect>
  )
}
