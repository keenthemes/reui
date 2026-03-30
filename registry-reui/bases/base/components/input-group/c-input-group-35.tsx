// Description: Password input with visibility toggle
// Order: 35

"use client"

import { useState } from "react"

import { Field } from "@/registry/bases/base/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/bases/base/ui/input-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupAddon>
          <IconPlaceholder
            lucide="LockIcon"
            tabler="IconLock"
            hugeicons="SquareLock01Icon"
            phosphor="LockSimpleIcon"
            remixicon="RiLockLine"
            className="text-muted-foreground size-4"
          />
        </InputGroupAddon>
        <InputGroupInput
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
        />
        <InputGroupButton
          variant="ghost"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <IconPlaceholder
              lucide="EyeOffIcon"
              tabler="IconEyeOff"
              hugeicons="ViewOffSlashIcon"
              phosphor="EyeSlashIcon"
              remixicon="RiEyeOffLine"
              className="text-muted-foreground size-4"
            />
          ) : (
            <IconPlaceholder
              lucide="EyeIcon"
              tabler="IconEye"
              hugeicons="ViewIcon"
              phosphor="EyeIcon"
              remixicon="RiEyeLine"
              className="text-muted-foreground size-4"
            />
          )}
        </InputGroupButton>
      </InputGroup>
    </Field>
  )
}
