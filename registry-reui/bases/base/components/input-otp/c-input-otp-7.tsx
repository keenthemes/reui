"use client"

import type { SlotProps } from "input-otp"

import { cn } from "@/registry/bases/base/lib/utils"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/registry/bases/base/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
} from "@/registry/bases/base/ui/input-otp"

function MaskedInputOTPSlot({ char, hasFakeCaret, isActive }: SlotProps) {
  return (
    <div
      aria-hidden="true"
      data-active={isActive}
      data-slot="input-otp-slot"
      className={cn(
        "cn-input-otp-slot relative flex items-center justify-center data-[active=true]:z-10"
      )}
    >
      {char ? "•" : null}
      {hasFakeCaret && (
        <div className="cn-input-otp-caret pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="cn-input-otp-caret-line" />
        </div>
      )}
    </div>
  )
}

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Field>
        <FieldLabel htmlFor="masked-render">Masked OTP</FieldLabel>
        <FieldDescription>
          Use the render function to obscure filled slots.
        </FieldDescription>
        <InputOTP
          id="masked-render"
          maxLength={6}
          render={({ slots }) => (
            <>
              <InputOTPGroup>
                {slots.slice(0, 3).map((slot, index) => (
                  <MaskedInputOTPSlot key={index} {...slot} />
                ))}
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                {slots.slice(3).map((slot, index) => (
                  <MaskedInputOTPSlot key={index + 3} {...slot} />
                ))}
              </InputOTPGroup>
            </>
          )}
        />
      </Field>
    </div>
  )
}
