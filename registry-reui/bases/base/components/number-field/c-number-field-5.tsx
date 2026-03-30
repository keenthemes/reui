// Description: Number field with spinner buttons
// Order: 5

import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "@/registry-reui/bases/base/reui/number-field"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="w-full max-w-48">
      <NumberField defaultValue={5} min={0} max={100}>
        <NumberFieldScrubArea label="Amount" />
        <NumberFieldGroup>
          <NumberFieldInput className="text-start" />

          <div className="border-input bg-muted/30 style-vega:rounded-md style-maia:rounded-4xl style-nova:rounded-lg style-lyra:rounded-none style-mira:rounded-md m-px flex shrink-0 flex-col overflow-hidden border">
            <NumberFieldIncrement className="border-input hover:bg-accent focus-visible:bg-accent flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! border-b px-1.5 leading-none">
              <IconPlaceholder
                lucide="ChevronUpIcon"
                tabler="IconChevronUp"
                hugeicons="ArrowUp01Icon"
                phosphor="CaretUpIcon"
                remixicon="RiArrowUpSLine"
                className="size-3.5"
              />
            </NumberFieldIncrement>
            <NumberFieldDecrement className="hover:bg-accent focus-visible:bg-accent flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! px-1.5 leading-none">
              <IconPlaceholder
                lucide="ChevronDownIcon"
                tabler="IconChevronDown"
                hugeicons="ArrowDown01Icon"
                phosphor="CaretDownIcon"
                remixicon="RiArrowDownSLine"
                className="size-3.5"
              />
            </NumberFieldDecrement>
          </div>
        </NumberFieldGroup>
      </NumberField>
    </div>
  )
}
