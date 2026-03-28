// Description: Font family select with preview
// Order: 31

import { Field } from "@/registry/bases/radix/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/radix/ui/select"

const fonts = [
  { value: "sans", label: "Inter", className: "font-sans" },
  { value: "mono", label: "Mono", className: "font-mono" },
  { value: "serif", label: "Serif", className: "font-serif" },
]

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <Select defaultValue={fonts[0].value}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select font" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {fonts.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                <span className={font.className}>{font.label}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
