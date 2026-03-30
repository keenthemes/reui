/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
  ButtonHTMLAttributes,
  createContext,
  CSSProperties,
  Fragment,
  HTMLAttributes,
  useContext,
} from "react"
import { ItemInstance } from "@headless-tree/core"
import { Slot } from "radix-ui"

import { cn } from "@/registry/bases/radix/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type ToggleIconType = "chevron" | "plus-minus"

interface TreeContextValue<T = any> {
  indent: number
  currentItem?: ItemInstance<T>
  tree?: any
  toggleIconType?: ToggleIconType
}

const TreeContext = createContext<TreeContextValue>({
  indent: 20,
  currentItem: undefined,
  tree: undefined,
  toggleIconType: "plus-minus",
})

function useTreeContext<T = any>() {
  return useContext(TreeContext) as TreeContextValue<T>
}

interface TreeProps extends HTMLAttributes<HTMLDivElement> {
  indent?: number
  tree?: any
  toggleIconType?: ToggleIconType
  asChild?: boolean
}

function Tree({
  indent = 20,
  tree,
  className,
  toggleIconType = "chevron",
  asChild = false,
  ...props
}: TreeProps) {
  const containerProps =
    tree && typeof tree.getContainerProps === "function"
      ? tree.getContainerProps()
      : {}
  const mergedProps = { ...props, ...containerProps }

  // Extract style from mergedProps to merge with our custom styles
  const { style: propStyle, ...otherProps } = mergedProps

  // Merge styles
  const mergedStyle = {
    ...propStyle,
    "--tree-indent": `${indent}px`,
  } as CSSProperties

  const Comp = asChild ? Slot.Root : "div"

  return (
    <TreeContext.Provider value={{ indent, tree, toggleIconType }}>
      <Comp
        data-slot="tree"
        style={mergedStyle}
        className={cn("flex flex-col", className)}
        {...otherProps}
      />
    </TreeContext.Provider>
  )
}

interface TreeItemProps<T = any> extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "indent"
> {
  item: ItemInstance<T>
  indent?: number
  asChild?: boolean
}

function TreeItem<T = any>({
  item,
  className,
  asChild = false,
  children,
  ...props
}: TreeItemProps<T>) {
  const parentContext = useTreeContext<T>()
  const { indent } = parentContext

  const itemProps = typeof item.getProps === "function" ? item.getProps() : {}
  const mergedProps = { ...props, children, ...itemProps }

  // Extract style from mergedProps to merge with our custom styles
  const { style: propStyle, ...otherProps } = mergedProps

  // Merge styles
  const mergedStyle = {
    ...propStyle,
    "--tree-padding": `${item.getItemMeta().level * indent}px`,
  } as CSSProperties

  const defaultProps = {
    "data-slot": "tree-item",
    style: mergedStyle,
    className: cn(
      "z-10 ps-(--tree-padding) outline-hidden select-none not-last:pb-0.5 focus:z-20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    "data-focus":
      typeof item.isFocused === "function"
        ? item.isFocused() || false
        : undefined,
    "data-folder":
      typeof item.isFolder === "function"
        ? item.isFolder() || false
        : undefined,
    "data-selected":
      typeof item.isSelected === "function"
        ? item.isSelected() || false
        : undefined,
    "data-drag-target":
      typeof item.isDragTarget === "function"
        ? item.isDragTarget() || false
        : undefined,
    "data-search-match":
      typeof item.isMatchingSearch === "function"
        ? item.isMatchingSearch() || false
        : undefined,
    "aria-expanded": item.isExpanded(),
  }

  const Comp = asChild ? Slot.Root : "button"

  return (
    <TreeContext.Provider value={{ ...parentContext, currentItem: item }}>
      <Comp {...defaultProps} {...otherProps}>
        {children}
      </Comp>
    </TreeContext.Provider>
  )
}

interface TreeItemLabelProps<T = any> extends HTMLAttributes<HTMLSpanElement> {
  item?: ItemInstance<T>
  asChild?: boolean
}

function TreeItemLabel<T = any>({
  item: propItem,
  children,
  className,
  asChild = false,
  ...props
}: TreeItemLabelProps<T>) {
  const { currentItem, toggleIconType } = useTreeContext<T>()
  const item = propItem || currentItem

  if (!item) {
    console.warn("TreeItemLabel: No item provided via props or context")
    return null
  }

  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="tree-item-label"
      className={cn(
        "in-focus-visible:ring-ring/50 bg-background hover:bg-accent in-data-[selected=true]:bg-accent in-data-[selected=true]:text-accent-foreground in-data-[drag-target=true]:bg-accent flex items-center gap-1 transition-colors not-in-data-[folder=true]:ps-7 in-focus-visible:ring-[3px] in-data-[search-match=true]:bg-blue-50! [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "style-vega:rounded-sm style-maia:rounded-sm style-nova:rounded-sm style-lyra:rounded-none style-mira:rounded-sm",
        "style-vega:py-1.5 style-maia:py-1.5 style-nova:py-1.5 style-lyra:py-1.5 style-mira:py-1",
        "style-vega:px-2 style-maia:px-2 style-nova:px-2 style-lyra:px-2 style-mira:px-1.5",
        "style-vega:text-sm style-maia:text-sm style-nova:text-sm style-lyra:text-xs style-mira:text-xs/relaxed",
        className
      )}
      {...props}
    >
      <Fragment>
        {item.isFolder() &&
          (toggleIconType === "plus-minus" ? (
            item.isExpanded() ? (
              <IconPlaceholder
                lucide="MinusIcon"
                tabler="IconMinus"
                hugeicons="MinusSignIcon"
                phosphor="MinusIcon"
                remixicon="RiSubtractLine"
                className="text-muted-foreground size-3.5"
                stroke="currentColor"
                strokeWidth="1"
              />
            ) : (
              <IconPlaceholder
                lucide="PlusIcon"
                tabler="IconPlus"
                hugeicons="PlusSignIcon"
                phosphor="PlusIcon"
                remixicon="RiAddLine"
                className="text-muted-foreground size-3.5"
                stroke="currentColor"
                strokeWidth="1"
              />
            )
          ) : (
            <IconPlaceholder
              lucide="ChevronDownIcon"
              tabler="IconChevronDown"
              hugeicons="ArrowDown01Icon"
              phosphor="CaretDownIcon"
              remixicon="RiArrowDownSLine"
              className="text-muted-foreground size-4 in-aria-[expanded=false]:-rotate-90"
            />
          ))}
        {children ||
          (typeof item.getItemName === "function" ? item.getItemName() : null)}
      </Fragment>
    </Comp>
  )
}

function TreeDragLine({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { tree } = useTreeContext()

  if (!tree || typeof tree.getDragLineStyle !== "function") {
    console.warn(
      "TreeDragLine: No tree provided via context or tree does not have getDragLineStyle method"
    )
    return null
  }

  const dragLine = tree.getDragLineStyle()
  return (
    <div
      style={dragLine}
      className={cn(
        "bg-primary before:bg-background before:border-primary absolute z-30 -mt-px h-0.5 w-[unset] before:absolute before:-top-[3px] before:left-0 before:size-2 before:border-2",
        "style-vega:before:rounded-full style-maia:before:rounded-full style-nova:before:rounded-full style-lyra:before:rounded-none style-mira:before:rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Tree, TreeItem, TreeItemLabel, TreeDragLine }
