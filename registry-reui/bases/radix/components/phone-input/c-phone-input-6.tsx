// Description: Phone input with error state
// Order: 6

import { PhoneInput } from "@/registry-reui/bases/radix/reui/phone-input"

export default function Pattern() {
  return <PhoneInput aria-invalid="true" placeholder="Enter phone number" />
}
