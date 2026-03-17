// Description: Payout release controls with amount context
// Order: 55

import { Button } from "@/registry/bases/base/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/registry/bases/base/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ButtonGroup>
        <ButtonGroupText className="border-input bg-muted/40 text-muted-foreground gap-1.5 border px-2.5 text-xs">
          <IconPlaceholder
            lucide="CreditCardIcon"
            tabler="IconCreditCard"
            hugeicons="CreditCardIcon"
            phosphor="CreditCardIcon"
            remixicon="RiBankCardLine"
            className="size-3.5 opacity-60"
            aria-hidden="true"
          />
          <span className="text-foreground font-medium tabular-nums">
            USD 12,480
          </span>
        </ButtonGroupText>
        <Button variant="outline" size="sm">
          Hold
        </Button>
      </ButtonGroup>

      <ButtonGroup className="**:data-[slot=button]:border-r-0">
        <Button size="sm">
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
            aria-hidden="true"
          />
          Release
        </Button>
        <ButtonGroupSeparator className="bg-primary/72" />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                size="icon-sm"
                className="border-primary-foreground/20 rounded-l-none border-l"
                aria-label="More payout actions"
              />
            }
          >
            <IconPlaceholder
              lucide="ChevronDownIcon"
              tabler="IconChevronDown"
              hugeicons="ArrowDown01Icon"
              phosphor="CaretDownIcon"
              remixicon="RiArrowDownSLine"
              aria-hidden="true"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-44">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="CalendarIcon"
                  tabler="IconCalendar"
                  hugeicons="Calendar01Icon"
                  phosphor="CalendarIcon"
                  remixicon="RiCalendarLine"
                  className="size-4 opacity-60"
                  aria-hidden="true"
                />
                Schedule for Friday
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="CreditCardIcon"
                  tabler="IconCreditCard"
                  hugeicons="CreditCardIcon"
                  phosphor="CreditCardIcon"
                  remixicon="RiBankCardLine"
                  className="size-4 opacity-60"
                  aria-hidden="true"
                />
                Change destination
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="FileTextIcon"
                  tabler="IconFileText"
                  hugeicons="FileEditIcon"
                  phosphor="FileTextIcon"
                  remixicon="RiFileTextLine"
                  className="size-4 opacity-60"
                  aria-hidden="true"
                />
                Export receipt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <IconPlaceholder
                  lucide="XIcon"
                  tabler="IconX"
                  hugeicons="Cancel01Icon"
                  phosphor="XIcon"
                  remixicon="RiCloseLine"
                  aria-hidden="true"
                />
                Cancel payout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </div>
  )
}
