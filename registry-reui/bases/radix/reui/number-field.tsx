"use client"

import { createContext, ReactNode, useContext, useId } from "react"
import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field"
import { cva, VariantProps } from "class-variance-authority"

import { cn } from "@/registry/bases/base/lib/utils"
import { Label } from "@/registry/bases/base/ui/label"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const NumberFieldContext = createContext<{
  fieldId: string
  size: "sm" | "default" | "lg"
} | null>(null)

const numberFieldGroupVariants = cva(
  "relative flex w-full justify-between border border-input data-disabled:pointer-events-none data-disabled:opacity-50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive focus-within:has-aria-invalid:border-destructive focus-within:has-aria-invalid:ring-destructive/20 dark:focus-within:has-aria-invalid:ring-destructive/40 style-vega:rounded-md style-nova:rounded-lg style-maia:rounded-4xl style-lyra:rounded-none style-mira:rounded-md style-luma:rounded-3xl style-rhea:rounded-2xl style-sera:rounded-none bg-transparent dark:bg-input/30 transition-colors focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-3",
  {
    variants: {
      size: {
        sm: "h-7 text-sm",
        default:
          "h-8 text-sm",
        lg: "h-9 text-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const numberFieldButtonVariants = cva(
  "relative flex shrink-0 cursor-pointer items-center justify-center transition-colors pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 hover:bg-accent",
  {
    variants: {
      size: {
        sm: "px-1.5 ([class*='size-'])]:size-3.5 ([class*='size-'])]:size-3.5 [&_svg:not([class*='size-'])]:size-3.5 ([class*='size-'])]:size-3.5 ([class*='size-'])]:size-3 ([class*='size-'])]:size-3.5 ([class*='size-'])]:size-3.5",
        default:
          "px-2 ([class*='size-'])]:size-4 ([class*='size-'])]:size-4 [&_svg:not([class*='size-'])]:size-4 ([class*='size-'])]:size-4 ([class*='size-'])]:size-3.5 ([class*='size-'])]:size-4 ([class*='size-'])]:size-3.5",
        lg: "px-2.5 ([class*='size-'])]:size-4 ([class*='size-'])]:size-4 [&_svg:not([class*='size-'])]:size-4 ([class*='size-'])]:size-4 ([class*='size-'])]:size-3.5 ([class*='size-'])]:size-4 ([class*='size-'])]:size-3.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const numberFieldInputVariants = cva(
  "w-full min-w-0 flex-1 bg-transparent text-center tabular-nums outline-none",
  {
    variants: {
      size: {
        sm: "px-2 py-0.5",
        default:
          "px-2.5 py-1",
        lg: "px-2.5 py-1.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function NumberField({
  id,
  className,
  size = "default",
  ...props
}: NumberFieldPrimitive.Root.Props &
  VariantProps<typeof numberFieldGroupVariants>) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const sizeValue = size ?? "default"

  return (
    <NumberFieldContext.Provider value={{ fieldId, size: sizeValue }}>
      <NumberFieldPrimitive.Root
        className={cn("flex w-full flex-col items-start gap-2", className)}
        data-size={sizeValue}
        data-slot="number-field"
        id={fieldId}
        {...props}
      />
    </NumberFieldContext.Provider>
  )
}

function NumberFieldGroup({
  className,
  size: sizeProp,
  ...props
}: NumberFieldPrimitive.Group.Props &
  Partial<VariantProps<typeof numberFieldGroupVariants>>) {
  const context = useContext(NumberFieldContext)
  if (!context) {
    throw new Error(
      "NumberFieldGroup must be used within a NumberField component."
    )
  }
  const size = sizeProp ?? context.size

  return (
    <NumberFieldPrimitive.Group
      className={cn(numberFieldGroupVariants({ size }), className)}
      data-slot="number-field-group"
      {...props}
    />
  )
}

function NumberFieldDecrement({
  className,
  size: sizeProp,
  children,
  ...props
}: NumberFieldPrimitive.Decrement.Props &
  Partial<VariantProps<typeof numberFieldButtonVariants>> & {
    children?: React.ReactNode
  }) {
  const context = useContext(NumberFieldContext)
  if (!context) {
    throw new Error(
      "NumberFieldDecrement must be used within a NumberField component."
    )
  }
  const size = sizeProp ?? context.size

  return (
    <NumberFieldPrimitive.Decrement
      className={cn(
        numberFieldButtonVariants({ size }),
        "style-vega:rounded-s-md style-nova:rounded-s-lg style-maia:rounded-s-4xl style-lyra:rounded-s-none style-mira:rounded-s-md style-luma:rounded-s-3xl style-rhea:rounded-s-2xl style-sera:rounded-s-none border-e-0",
        className
      )}
      data-slot="number-field-decrement"
      {...props}
    >
      {children ?? (
        <IconPlaceholder
          lucide="MinusIcon"
          tabler="IconMinus"
          hugeicons="MinusSignIcon"
          phosphor="MinusIcon"
          remixicon="RiSubtractLine"
        />
      )}
    </NumberFieldPrimitive.Decrement>
  )
}

function NumberFieldIncrement({
  className,
  size: sizeProp,
  children,
  ...props
}: NumberFieldPrimitive.Increment.Props &
  Partial<VariantProps<typeof numberFieldButtonVariants>> & {
    children?: ReactNode
  }) {
  const context = useContext(NumberFieldContext)
  if (!context) {
    throw new Error(
      "NumberFieldIncrement must be used within a NumberField component."
    )
  }
  const size = sizeProp ?? context.size

  return (
    <NumberFieldPrimitive.Increment
      className={cn(
        numberFieldButtonVariants({ size }),
        "style-vega:rounded-e-md style-nova:rounded-e-lg style-maia:rounded-e-4xl style-lyra:rounded-e-none style-mira:rounded-e-md style-luma:rounded-e-3xl style-rhea:rounded-e-2xl style-sera:rounded-e-none border-s-0",
        className
      )}
      data-slot="number-field-increment"
      {...props}
    >
      {children ?? (
        <IconPlaceholder
          lucide="PlusIcon"
          tabler="IconPlus"
          hugeicons="PlusSignIcon"
          phosphor="PlusIcon"
          remixicon="RiAddLine"
        />
      )}
    </NumberFieldPrimitive.Increment>
  )
}

function NumberFieldInput({
  className,
  size: sizeProp,
  ...props
}: NumberFieldPrimitive.Input.Props &
  Partial<VariantProps<typeof numberFieldInputVariants>>) {
  const context = useContext(NumberFieldContext)
  if (!context) {
    throw new Error(
      "NumberFieldInput must be used within a NumberField component."
    )
  }
  const size = sizeProp ?? context.size

  return (
    <NumberFieldPrimitive.Input
      className={cn(numberFieldInputVariants({ size }), className)}
      data-slot="number-field-input"
      {...props}
    />
  )
}

function NumberFieldScrubArea({
  className,
  label,
  ...props
}: NumberFieldPrimitive.ScrubArea.Props & {
  label: string
}) {
  const context = useContext(NumberFieldContext)
  if (!context) {
    throw new Error(
      "NumberFieldScrubArea must be used within a NumberField component for accessibility."
    )
  }

  return (
    <NumberFieldPrimitive.ScrubArea
      className={cn("flex cursor-ew-resize", className)}
      data-slot="number-field-scrub-area"
      {...props}
    >
      <Label className="cursor-ew-resize" htmlFor={context.fieldId}>
        {label}
      </Label>
      <NumberFieldPrimitive.ScrubAreaCursor className="drop-shadow-[0_1px_1px_#0008] filter">
        <CursorGrowIcon />
      </NumberFieldPrimitive.ScrubAreaCursor>
    </NumberFieldPrimitive.ScrubArea>
  )
}

function CursorGrowIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      fill="black"
      height="14"
      stroke="white"
      viewBox="0 0 24 14"
      width="26"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z" />
    </svg>
  )
}

export {
  NumberField,
  NumberFieldScrubArea,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldGroup,
  NumberFieldInput,
}
