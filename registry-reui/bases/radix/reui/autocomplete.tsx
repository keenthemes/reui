"use client"

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/bases/base/lib/utils"
import { ScrollArea } from "@/registry/bases/base/ui/scroll-area"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const inputVariants = cva(
  "outline-none flex w-full text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [[readonly]]:bg-muted/80 [[readonly]]:cursor-not-allowed border border-input focus-visible:border-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 style-vega:rounded-md style-nova:rounded-lg style-maia:rounded-4xl style-lyra:rounded-none style-mira:rounded-md style-luma:rounded-3xl style-rhea:rounded-2xl style-sera:rounded-none bg-transparent dark:bg-input/30 text-sm transition-colors focus-visible:ring-ring/50 focus-visible:ring-3 aria-invalid:ring-3",
  {
    variants: {
      size: {
        sm: "h-7 px-2 [&~[data-slot=autocomplete-clear]]:end-1.5 [&~[data-slot=autocomplete-trigger]]:end-1.5",
        default:
          "h-8 px-2.5 [&~[data-slot=autocomplete-clear]]:end-1.75 [&~[data-slot=autocomplete-trigger]]:end-1.75",
        lg: "h-9 px-2.5 [&~[data-slot=autocomplete-clear]]:end-2 [&~[data-slot=autocomplete-trigger]]:end-2",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const Autocomplete = AutocompletePrimitive.Root

function AutocompleteValue({ ...props }: AutocompletePrimitive.Value.Props) {
  return (
    <AutocompletePrimitive.Value data-slot="autocomplete-value" {...props} />
  )
}

function AutocompleteInput({
  className,
  size = "default",
  showClear = false,
  showTrigger = false,
  ...props
}: Omit<AutocompletePrimitive.Input.Props, "size"> &
  VariantProps<typeof inputVariants> & {
    showClear?: boolean
    showTrigger?: boolean
  }) {
  return (
    <div className="relative w-full">
      <AutocompletePrimitive.Input
        data-slot="autocomplete-input"
        data-size={size}
        className={cn(inputVariants({ size }), className)}
        {...props}
      />
      {showTrigger && <AutocompleteTrigger />}
      {showClear && <AutocompleteClear />}
    </div>
  )
}

function AutocompleteStatus({
  className,
  ...props
}: AutocompletePrimitive.Status.Props) {
  return (
    <AutocompletePrimitive.Status
      data-slot="autocomplete-status"
      className={cn(
        "text-muted-foreground px-2 py-1.5 text-sm empty:m-0 empty:p-0",
        className
      )}
      {...props}
    />
  )
}

function AutocompletePortal({ ...props }: AutocompletePrimitive.Portal.Props) {
  return (
    <AutocompletePrimitive.Portal data-slot="autocomplete-portal" {...props} />
  )
}

function AutocompleteBackdrop({
  ...props
}: AutocompletePrimitive.Backdrop.Props) {
  return (
    <AutocompletePrimitive.Backdrop
      data-slot="autocomplete-backdrop"
      {...props}
    />
  )
}

function AutocompletePositioner({
  className,
  ...props
}: AutocompletePrimitive.Positioner.Props) {
  return (
    <AutocompletePrimitive.Positioner
      data-slot="autocomplete-positioner"
      className={cn("z-50 outline-none", className)}
      {...props}
    />
  )
}

function AutocompleteList({
  className,
  scrollAreaClassName,
  ...props
}: AutocompletePrimitive.List.Props & {
  scrollAreaClassName?: string
  scrollFade?: boolean
  scrollbarGutter?: boolean
}) {
  return (
    <ScrollArea
      className={cn(
        "size-full min-h-0 **:data-[slot=scroll-area-viewport]:h-full **:data-[slot=scroll-area-viewport]:overscroll-contain",
        scrollAreaClassName
      )}
    >
      <AutocompletePrimitive.List
        data-slot="autocomplete-list"
        className={cn(
          "not-empty:px-1 not-empty:py-1 not-empty:scroll-py-1 in-data-has-overflow-y:me-3",
          className
        )}
        {...props}
      />
    </ScrollArea>
  )
}

function AutocompleteCollection({
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Collection>) {
  return (
    <AutocompletePrimitive.Collection
      data-slot="autocomplete-collection"
      {...props}
    />
  )
}

function AutocompleteRow({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Row>) {
  return (
    <AutocompletePrimitive.Row
      data-slot="autocomplete-row"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function AutocompleteItem({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Item>) {
  return (
    <AutocompletePrimitive.Item
      data-slot="autocomplete-item"
      className={cn(
        "text-foreground data-highlighted:text-foreground data-highlighted:before:bg-accent gap-1.5",
        "style-vega:rounded-sm style-nova:rounded-md style-maia:rounded-xl style-lyra:rounded-none style-mira:rounded-md style-luma:rounded-2xl style-rhea:rounded-2xl style-sera:rounded-none",
        "style-vega:data-highlighted:before:rounded-sm style-nova:data-highlighted:before:rounded-md style-maia:data-highlighted:before:rounded-xl style-lyra:data-highlighted:before:rounded-none style-mira:data-highlighted:before:rounded-md style-luma:data-highlighted:before:rounded-2xl style-rhea:data-highlighted:before:rounded-2xl style-sera:data-highlighted:before:rounded-none",
        "px-1.5 py-1 text-sm ([class*='size-'])]:size-4 ([class*='size-'])]:size-4 [&_svg:not([class*='size-'])]:size-4 ([class*='size-'])]:size-4 ([class*='size-'])]:size-3.5 ([class*='size-'])]:size-4 ([class*='size-'])]:size-3.5 relative flex cursor-default items-center outline-hidden transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:relative data-highlighted:z-0 data-highlighted:before:absolute data-highlighted:before:inset-x-0 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([role=img]):not([class*=text-])]:opacity-60",
        className
      )}
      {...props}
    />
  )
}

export interface AutocompleteContentProps extends React.ComponentProps<
  typeof AutocompletePrimitive.Popup
> {
  align?: AutocompletePrimitive.Positioner.Props["align"]
  sideOffset?: AutocompletePrimitive.Positioner.Props["sideOffset"]
  alignOffset?: AutocompletePrimitive.Positioner.Props["alignOffset"]
  side?: AutocompletePrimitive.Positioner.Props["side"]
  anchor?: AutocompletePrimitive.Positioner.Props["anchor"]
  showBackdrop?: boolean
}

function AutocompleteContent({
  className,
  children,
  showBackdrop = false,
  align = "start",
  sideOffset = 4,
  alignOffset = 0,
  side = "bottom",
  anchor,
  ...props
}: AutocompleteContentProps) {
  return (
    <AutocompletePortal>
      {showBackdrop && <AutocompleteBackdrop />}
      <AutocompletePositioner
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        side={side}
        anchor={anchor}
      >
        <div className="relative flex max-h-full">
          <AutocompletePrimitive.Popup
            data-slot="autocomplete-popup"
            className={cn(
              "bg-popover text-popover-foreground style-vega:rounded-md style-nova:rounded-lg style-maia:rounded-2xl style-lyra:rounded-none style-mira:rounded-lg style-luma:rounded-3xl style-rhea:rounded-2xl style-sera:rounded-none shadow-md ring-foreground/10 flex max-h-[min(var(--available-height),24rem)] w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) scroll-pt-2 scroll-pb-2 flex-col overscroll-contain py-0.5 ring-1 transition-[scale,opacity] has-data-starting-style:scale-98 has-data-starting-style:opacity-0 has-data-[side=none]:scale-100 has-data-[side=none]:transition-none",
              className
            )}
            {...props}
          >
            {children}
          </AutocompletePrimitive.Popup>
        </div>
      </AutocompletePositioner>
    </AutocompletePortal>
  )
}

function AutocompleteGroup({
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Group>) {
  return (
    <AutocompletePrimitive.Group data-slot="autocomplete-group" {...props} />
  )
}

function AutocompleteGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.GroupLabel>) {
  return (
    <AutocompletePrimitive.GroupLabel
      data-slot="autocomplete-group-label"
      className={cn(
        "text-muted-foreground px-1.5 py-1 text-xs font-medium",
        className
      )}
      {...props}
    />
  )
}

function AutocompleteEmpty({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Empty>) {
  return (
    <AutocompletePrimitive.Empty
      data-slot="autocomplete-empty"
      className={cn(
        "text-muted-foreground px-2 py-1.5 text-sm text-center empty:m-0 empty:p-0",
        className
      )}
      {...props}
    />
  )
}

function AutocompleteClear({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Clear>) {
  return (
    <AutocompletePrimitive.Clear
      data-slot="autocomplete-clear"
      className={cn(
        "ring-offset-background focus:ring-ring absolute top-1/2 -translate-y-1/2 cursor-pointer opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none data-disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      <IconPlaceholder
        lucide="XIcon"
        tabler="IconX"
        hugeicons="Cancel01Icon"
        phosphor="XIcon"
        remixicon="RiCloseLine"
        className="size-4"
      />
    </AutocompletePrimitive.Clear>
  )
}

function AutocompleteTrigger({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Trigger>) {
  return (
    <AutocompletePrimitive.Trigger
      data-slot="autocomplete-trigger"
      className={cn(
        "focus:ring-ring ring-offset-background absolute top-1/2 -translate-y-1/2 cursor-pointer focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none has-[+[data-slot=autocomplete-clear]]:hidden data-disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      <IconPlaceholder
        lucide="ChevronsUpDownIcon"
        tabler="IconSelector"
        hugeicons="UnfoldMoreIcon"
        phosphor="CaretUpDownIcon"
        remixicon="RiExpandUpDownLine"
        className="size-4 opacity-70"
      />
    </AutocompletePrimitive.Trigger>
  )
}

function AutocompleteArrow({
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Arrow>) {
  return (
    <AutocompletePrimitive.Arrow data-slot="autocomplete-arrow" {...props} />
  )
}

function AutocompleteSeparator({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Separator>) {
  return (
    <AutocompletePrimitive.Separator
      data-slot="autocomplete-separator"
      className={cn(
        "bg-border my-1.5 h-px",
        className
      )}
      {...props}
    />
  )
}

export {
  Autocomplete,
  AutocompleteValue,
  AutocompleteTrigger,
  AutocompleteInput,
  AutocompleteStatus,
  AutocompletePortal,
  AutocompleteBackdrop,
  AutocompletePositioner,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteCollection,
  AutocompleteRow,
  AutocompleteItem,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteEmpty,
  AutocompleteClear,
  AutocompleteArrow,
  AutocompleteSeparator,
}
