// Description: Clickable navigation items with icons and chevron
// Order: 4

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/registry/bases/base/ui/item"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <ItemGroup className="gap-0">
        <Item render={<a href="#" />} size="xs">
          <ItemMedia variant="icon">
            <IconPlaceholder
              lucide="UserIcon"
              tabler="IconUser"
              hugeicons="UserIcon"
              phosphor="UserIcon"
              remixicon="RiUserLine"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Profile</ItemTitle>
            <ItemDescription>Manage your account details</ItemDescription>
          </ItemContent>
          <ItemActions>
            <IconPlaceholder
              lucide="ChevronRightIcon"
              tabler="IconChevronRight"
              hugeicons="ArrowRight01Icon"
              phosphor="CaretRightIcon"
              remixicon="RiArrowRightSLine"
              className="text-muted-foreground size-4"
            />
          </ItemActions>
        </Item>
        <ItemSeparator />
        <Item render={<a href="#" />} size="xs">
          <ItemMedia variant="icon">
            <IconPlaceholder
              lucide="ShieldIcon"
              tabler="IconShield"
              hugeicons="Shield01Icon"
              phosphor="ShieldIcon"
              remixicon="RiShieldLine"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Security</ItemTitle>
            <ItemDescription>Password and two-factor auth</ItemDescription>
          </ItemContent>
          <ItemActions>
            <IconPlaceholder
              lucide="ChevronRightIcon"
              tabler="IconChevronRight"
              hugeicons="ArrowRight01Icon"
              phosphor="CaretRightIcon"
              remixicon="RiArrowRightSLine"
              className="text-muted-foreground size-4"
            />
          </ItemActions>
        </Item>
        <ItemSeparator />
        <Item render={<a href="#" />} size="xs">
          <ItemMedia variant="icon">
            <IconPlaceholder
              lucide="CreditCardIcon"
              tabler="IconCreditCard"
              hugeicons="CreditCardIcon"
              phosphor="CreditCardIcon"
              remixicon="RiBankCardLine"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Billing</ItemTitle>
            <ItemDescription>Plans, invoices, and payment</ItemDescription>
          </ItemContent>
          <ItemActions>
            <IconPlaceholder
              lucide="ChevronRightIcon"
              tabler="IconChevronRight"
              hugeicons="ArrowRight01Icon"
              phosphor="CaretRightIcon"
              remixicon="RiArrowRightSLine"
              className="text-muted-foreground size-4"
            />
          </ItemActions>
        </Item>
      </ItemGroup>
    </div>
  )
}
