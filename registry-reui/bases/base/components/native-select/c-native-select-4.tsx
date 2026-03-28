// Description: Native select embedded within a field.
// Order: 4

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/registry/bases/base/ui/field"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/base/ui/native-select"

export default function Pattern() {
  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="native-select-country">Country</FieldLabel>
      <NativeSelect id="native-select-country">
        <NativeSelectOption value="">Select a country</NativeSelectOption>
        <NativeSelectOption value="us">United States</NativeSelectOption>
        <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
        <NativeSelectOption value="ca">Canada</NativeSelectOption>
      </NativeSelect>
      <FieldDescription>Select your country of residence.</FieldDescription>
    </Field>
  )
}
