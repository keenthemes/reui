// Description: Large phone input
// Order: 3

import { PhoneInput } from "@/registry-reui/bases/base/reui/phone-input"

export default function Pattern() {
  return (
    <PhoneInput
      variant="lg"
      placeholder="Enter phone number"
      defaultCountry="US"
      value="+12125551234"
    />
  )
}
