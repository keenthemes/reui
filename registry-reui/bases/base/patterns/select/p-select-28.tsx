// Description: Timezone select with UTC offsets
// Order: 28

import { Field } from "@/registry/bases/base/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"

const americas = [
  { value: "est", label: "EST", offset: "UTC-5" },
  { value: "cst", label: "CST", offset: "UTC-6" },
  { value: "pst", label: "PST", offset: "UTC-8" },
]

const europe = [
  { value: "gmt", label: "GMT", offset: "UTC+0" },
  { value: "cet", label: "CET", offset: "UTC+1" },
]

const asia = [
  { value: "ist", label: "IST", offset: "UTC+5:30" },
  { value: "jst", label: "JST", offset: "UTC+9" },
]

const allItems = [
  { label: "Select a timezone", value: null },
  ...americas.map((tz) => ({
    label: `${tz.label} (${tz.offset})`,
    value: tz.value,
  })),
  ...europe.map((tz) => ({
    label: `${tz.label} (${tz.offset})`,
    value: tz.value,
  })),
  ...asia.map((tz) => ({
    label: `${tz.label} (${tz.offset})`,
    value: tz.value,
  })),
]

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <Select items={allItems}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            <SelectLabel>Americas</SelectLabel>
            {americas.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                <span className="flex items-center justify-between gap-3">
                  <span>{tz.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {tz.offset}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            {europe.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                <span className="flex items-center justify-between gap-3">
                  <span>{tz.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {tz.offset}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Asia</SelectLabel>
            {asia.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                <span className="flex items-center justify-between gap-3">
                  <span>{tz.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {tz.offset}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
