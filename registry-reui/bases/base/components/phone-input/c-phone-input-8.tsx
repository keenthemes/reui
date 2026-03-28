// Description: Read-only phone input
// Order: 8

import { PhoneInput } from "@/registry-reui/bases/base/reui/phone-input"

export default function Pattern() {
  return (
    <PhoneInput
      readOnly
      value="+12125551234"
      placeholder="Enter phone number"
    />
  )
}
