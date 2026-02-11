// Description: Input label with link and visibility toggle
// Order: 19

"use client"

import { useState } from "react"

import { Field, FieldLabel } from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const toggleVisibility = () => setIsVisible((prevState) => !prevState)

  return (
    <Field className="w-full max-w-xs">
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor="password-link">Password</FieldLabel>
        <a
          href="#"
          className="text-primary text-xs font-medium hover:underline"
        >
          Forgot password?
        </a>
      </div>
      <div className="relative">
        <Input
          id="password-link"
          type={isVisible ? "text" : "password"}
          className="pe-9"
        />
        <button
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          onClick={toggleVisibility}
          type="button"
        >
          {isVisible ? (
            <IconPlaceholder
              lucide="EyeOffIcon"
              tabler="IconEyeOff"
              hugeicons="ViewOffSlashIcon"
              phosphor="EyeSlashIcon"
              remixicon="RiEyeOffLine"
              aria-hidden="true"
            />
          ) : (
            <IconPlaceholder
              lucide="EyeIcon"
              tabler="IconEye"
              hugeicons="ViewIcon"
              phosphor="EyeIcon"
              remixicon="RiEyeLine"
              aria-hidden="true"
            />
          )}
        </button>
      </div>
    </Field>
  )
}
