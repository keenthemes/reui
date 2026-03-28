// Description: Country picker select with flag emojis
// Order: 25

import { Field } from "@/registry/bases/radix/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/radix/ui/select"

const countries = [
  { value: "us", label: "United States", flag: "\u{1F1FA}\u{1F1F8}" },
  { value: "gb", label: "United Kingdom", flag: "\u{1F1EC}\u{1F1E7}" },
  { value: "de", label: "Germany", flag: "\u{1F1E9}\u{1F1EA}" },
  { value: "fr", label: "France", flag: "\u{1F1EB}\u{1F1F7}" },
  { value: "jp", label: "Japan", flag: "\u{1F1EF}\u{1F1F5}" },
  { value: "au", label: "Australia", flag: "\u{1F1E6}\u{1F1FA}" },
]

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <Select defaultValue={countries[0].value}>
        <SelectTrigger>
          <SelectValue placeholder="Select country" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {countries.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                <span className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span>{country.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
