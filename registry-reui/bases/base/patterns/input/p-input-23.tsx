// Description: Advanced password strength indicator with progress
// Order: 23

"use client"

import { useId, useMemo, useState } from "react"

import { Field, FieldLabel } from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const id = useId()
  const [password, setPassword] = useState("")
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const toggleVisibility = () => setIsVisible((prevState) => !prevState)

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
      {
        regex: /[!@#$%^&*(),.?":{}|<>]/,
        text: "At least 1 special character",
      },
    ]

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }))
  }

  const strength = checkStrength(password)

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length
  }, [strength])

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border"
    if (score <= 1) return "bg-red-500"
    if (score <= 2) return "bg-orange-500"
    if (score <= 3) return "bg-amber-500"
    if (score <= 4) return "bg-green-500"
    return "bg-emerald-500"
  }

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password"
    if (score <= 2) return "Weak security"
    if (score <= 4) return "Medium security"
    return "Strong security"
  }

  return (
    <div className="w-full max-w-xs">
      <Field>
        <FieldLabel htmlFor={id}>Secure Password</FieldLabel>
        <div className="relative">
          <Input
            aria-describedby={`${id}-description`}
            className="pe-9"
            id={id}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            type={isVisible ? "text" : "password"}
            value={password}
          />
          <button
            aria-controls="password"
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
                className="size-3.5"
                aria-hidden="true"
              />
            ) : (
              <IconPlaceholder
                lucide="EyeIcon"
                tabler="IconEye"
                hugeicons="ViewIcon"
                phosphor="EyeIcon"
                remixicon="RiEyeLine"
                className="size-3.5"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </Field>

      {/* Segmented Progress Bar */}
      <div
        aria-label="Password strength"
        aria-valuemax={5}
        aria-valuemin={0}
        aria-valuenow={strengthScore}
        className="mt-3 mb-4 flex gap-1"
        role="progressbar"
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
              i < strengthScore ? getStrengthColor(strengthScore) : "bg-border"
            }`}
          />
        ))}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <p
          className="text-foreground text-sm font-medium"
          id={`${id}-description`}
        >
          {getStrengthText(strengthScore)}
        </p>
        <span className="text-muted-foreground text-xs">
          {strengthScore}/5 requirements met
        </span>
      </div>

      <ul aria-label="Password requirements" className="space-y-1.5">
        {strength.map((req) => (
          <li className="flex items-center gap-1" key={req.text}>
            {req.met ? (
              <IconPlaceholder
                lucide="CheckIcon"
                tabler="IconCheck"
                hugeicons="Tick02Icon"
                phosphor="CheckIcon"
                remixicon="RiCheckLine"
                className="size-3.5 text-emerald-500"
                aria-hidden="true"
              />
            ) : (
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="MultiplicationSignIcon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
                className="text-muted-foreground/60 size-3.5"
                aria-hidden="true"
              />
            )}
            <span
              className={`text-xs transition-colors ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
            >
              {req.text}
              <span className="sr-only">
                {req.met ? " - Requirement met" : " - Requirement not met"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
