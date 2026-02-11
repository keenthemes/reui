// Description: Phone input with specific default country
// Order: 7

import { PhoneInput } from "@/registry-reui/bases/base/reui/phone-input"

export default function Pattern() {
  return <PhoneInput defaultCountry="FR" placeholder="Enter phone number" />
}
