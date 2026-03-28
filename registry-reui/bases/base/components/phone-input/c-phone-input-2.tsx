// Description: Small phone input
// Order: 2

import { PhoneInput } from "@/registry-reui/bases/base/reui/phone-input"

export default function Pattern() {
  return (
    <PhoneInput
      variant="sm"
      placeholder="Enter phone number"
      defaultCountry="NL"
      value="+31612345678"
    />
  )
}
