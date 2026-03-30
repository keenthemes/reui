// Description: Collapsible form fields
// Order: 5

"use client"

import { useState } from "react"

import { Button } from "@/registry/bases/base/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/bases/base/ui/collapsible"
import { Field, FieldGroup, FieldLabel } from "@/registry/bases/base/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/registry/bases/base/ui/input-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="h-54 w-full max-w-xs">
      <Card size="sm">
        <CardHeader>
          <CardTitle>Unit Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="flex flex-col gap-3"
          >
            <div className="flex items-end gap-2">
              <Field className="flex-1">
                <FieldLabel className="sr-only">Base Price</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type="number"
                    placeholder="0.00"
                    defaultValue="19.00"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <CollapsibleTrigger
                render={
                  <Button variant="outline" size="icon" className="shrink-0" />
                }
              >
                <IconPlaceholder
                  lucide="Settings2Icon"
                  tabler="IconAdjustmentsHorizontal"
                  hugeicons="FilterHorizontalIcon"
                  phosphor="SlidersHorizontalIcon"
                  remixicon="RiEqualizer2Line"
                  aria-hidden="true"
                  className="size-3.5"
                />
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
              <FieldGroup className="gap-2">
                <Field>
                  <FieldLabel>Tax Rate (%)</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      type="number"
                      placeholder="0"
                      defaultValue="15"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>%</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel>Discount (%)</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      type="number"
                      placeholder="0"
                      defaultValue="0"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>%</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              </FieldGroup>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  )
}
