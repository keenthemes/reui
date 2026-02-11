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
  "relative flex w-full justify-between border border-input data-disabled:pointer-events-none data-disabled:opacity-50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive focus-within:has-aria-invalid:border-destructive focus-within:has-aria-invalid:ring-destructive/20 dark:focus-within:has-aria-invalid:ring-destructive/40 style-vega:rounded-md style-maia:rounded-4xl style-nova:rounded-lg style-lyra:rounded-none style-mira:rounded-md style-vega:bg-transparent style-vega:dark:bg-input/30 style-maia:bg-input/30 style-nova:bg-transparent style-nova:dark:bg-input/30 style-lyra:bg-transparent style-lyra:dark:bg-input/30 style-mira:bg-input/20 style-mira:dark:bg-input/30 style-vega:shadow-xs style-vega:transition-[color,box-shadow] style-maia:transition-colors style-nova:transition-colors style-lyra:transition-colors style-mira:transition-colors style-vega:focus-within:border-ring style-vega:focus-within:ring-ring/50 style-vega:focus-within:ring-3 style-maia:focus-within:border-ring style-maia:focus-within:ring-ring/50 style-maia:focus-within:ring-[3px] style-nova:focus-within:border-ring style-nova:focus-within:ring-ring/50 style-nova:focus-within:ring-3 style-lyra:focus-within:border-ring style-lyra:focus-within:ring-ring/50 style-lyra:focus-within:ring-1 style-mira:focus-within:border-ring style-mira:focus-within:ring-ring/30 style-mira:focus-within:ring-2",
  {
    variants: {
      size: {
        sm: "style-vega:h-8 style-vega:text-sm style-maia:h-8 style-maia:text-sm style-nova:h-7 style-nova:text-sm style-lyra:h-7 style-lyra:text-xs style-mira:h-6 style-mira:text-xs/relaxed",
        default:
          "style-vega:h-9 style-vega:text-sm style-maia:h-9 style-maia:text-sm style-nova:h-8 style-nova:text-sm style-lyra:h-8 style-lyra:text-xs style-mira:h-7 style-mira:text-xs/relaxed",
        lg: "style-vega:h-10 style-vega:text-sm style-maia:h-10 style-maia:text-sm style-nova:h-9 style-nova:text-sm style-lyra:h-9 style-lyra:text-xs style-mira:h-8 style-mira:text-xs/relaxed",
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
        sm: "style-vega:px-2 style-maia:px-2 style-nova:px-1.5 style-lyra:px-1.5 style-mira:px-1.5 style-vega:[&_svg:not([class*='size-'])]:size-3.5 style-maia:[&_svg:not([class*='size-'])]:size-3.5 style-nova:[&_svg:not([class*='size-'])]:size-3.5 style-lyra:[&_svg:not([class*='size-'])]:size-3.5 style-mira:[&_svg:not([class*='size-'])]:size-3",
        default:
          "style-vega:px-2.5 style-maia:px-2.5 style-nova:px-2 style-lyra:px-2 style-mira:px-1.5 style-vega:[&_svg:not([class*='size-'])]:size-4 style-maia:[&_svg:not([class*='size-'])]:size-4 style-nova:[&_svg:not([class*='size-'])]:size-4 style-lyra:[&_svg:not([class*='size-'])]:size-4 style-mira:[&_svg:not([class*='size-'])]:size-3.5",
        lg: "style-vega:px-3 style-maia:px-3 style-nova:px-2.5 style-lyra:px-2.5 style-mira:px-2 style-vega:[&_svg:not([class*='size-'])]:size-4 style-maia:[&_svg:not([class*='size-'])]:size-4 style-nova:[&_svg:not([class*='size-'])]:size-4 style-lyra:[&_svg:not([class*='size-'])]:size-4 style-mira:[&_svg:not([class*='size-'])]:size-3.5",
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
        sm: "style-vega:px-2.5 style-vega:py-1 style-maia:px-2.5 style-maia:py-1 style-nova:px-2 style-nova:py-0.5 style-lyra:px-2 style-lyra:py-0.5 style-mira:px-1.5 style-mira:py-0.5",
        default:
          "style-vega:px-3 style-vega:py-1.5 style-maia:px-3 style-maia:py-1.5 style-nova:px-2.5 style-nova:py-1 style-lyra:px-2.5 style-lyra:py-1 style-mira:px-2 style-mira:py-0.5",
        lg: "style-vega:px-3 style-vega:py-2 style-maia:px-3.5 style-maia:py-2 style-nova:px-2.5 style-nova:py-1.5 style-lyra:px-2.5 style-lyra:py-1.5 style-mira:px-2.5 style-mira:py-1",
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
        "style-vega:rounded-s-md style-maia:rounded-s-4xl style-nova:rounded-s-lg style-lyra:rounded-s-none style-mira:rounded-s-md border-e-0",
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
        "style-vega:rounded-e-md style-maia:rounded-e-4xl style-nova:rounded-e-lg style-lyra:rounded-e-none style-mira:rounded-e-md border-s-0",
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
