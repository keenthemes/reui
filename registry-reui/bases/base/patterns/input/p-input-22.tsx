// Description: Basic password strength with dynamic hint and icons
// Order: 22

"use client"

import { useId, useState } from "react"

import { cn } from "@/registry/bases/base/lib/utils"
import { Field, FieldLabel } from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const id = useId()
  const [password, setPassword] = useState("")

  const getStrength = (pass: string) => {
    const requirements = [
      { met: pass.length >= 8, text: "8+ characters" },
      { met: /[0-9]/.test(pass), text: "a number" },
      { met: /[!@#$%^&*]/.test(pass), text: "a special character" },
    ]
    const metCount = requirements.filter((r) => r.met).length
    return { requirements, metCount }
  }

  const { metCount } = getStrength(password)

  const getHint = () => {
    if (!password) {
      return "Use 8+ characters with a number and a special character."
    }
    if (metCount === 3) {
      return "Strong password. You're all set!"
    }
    if (metCount === 2) {
      return "Almost there! Add the missing requirement."
    }
    return "Weak password. Include 8+ characters, a number, and a special character."
  }

  const getStatus = () => {
    if (!password)
      return {
        color: "text-muted-foreground",
        icon: (
          <IconPlaceholder
            lucide="InfoIcon"
            tabler="IconInfoCircle"
            hugeicons="InformationCircleIcon"
            phosphor="InfoIcon"
            remixicon="RiInformationLine"
            className="size-3.5 shrink-0"
          />
        ),
      }
    if (metCount === 3)
      return {
        color: "text-emerald-500",
        icon: (
          <IconPlaceholder
            lucide="CircleCheckIcon"
            tabler="IconCircleCheck"
            hugeicons="CheckmarkCircle01Icon"
            phosphor="CheckCircleIcon"
            remixicon="RiCheckboxCircleLine"
            className="size-3.5 shrink-0"
          />
        ),
      }
    if (metCount === 2)
      return {
        color: "text-amber-500",
        icon: (
          <IconPlaceholder
            lucide="AlertTriangleIcon"
            tabler="IconAlertTriangle"
            hugeicons="Alert02Icon"
            phosphor="WarningIcon"
            remixicon="RiAlertLine"
            className="size-3.5 shrink-0"
          />
        ),
      }
    return {
      color: "text-destructive",
      icon: (
        <IconPlaceholder
          lucide="AlertTriangleIcon"
          tabler="IconAlertTriangle"
          hugeicons="Alert02Icon"
          phosphor="WarningIcon"
          remixicon="RiAlertLine"
          className="size-3.5 shrink-0"
        />
      ),
    }
  }

  const { color, icon: StatusIcon } = getStatus()

  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor={id}>Password</FieldLabel>
      <Input
        id={id}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <div
        className={cn(
          "flex items-center gap-2 text-xs transition-colors duration-200",
          color
        )}
      >
        {StatusIcon}
        <p>{getHint()}</p>
      </div>
    </Field>
  )
}
