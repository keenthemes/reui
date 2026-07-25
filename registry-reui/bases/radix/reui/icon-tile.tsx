// Title: Icon Tile
// Description: Square container that gives icons a consistent surface

import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/registry/bases/radix/lib/utils"

/**
 * CSS variable architecture:
 *
 * The root owns four variables so every part of the tile stays in proportion
 * and stays overridable from a single `className`:
 *
 *   --icon-tile-size       tile width/height
 *   --icon-tile-icon-size  glyph size applied to child svgs
 *   --icon-tile-radius     corner radius (also drives the nested inner card)
 *   --icon-tile-inset      gap between the outer ring and the inner card
 *
 * The `frame` and `soft` variants paint their inner card with an `::after`
 * pseudo element instead of a wrapper node. `isolate` makes the root a stacking
 * context, so the negative z-index pseudo paints above the root background but
 * below the in-flow icon - no extra DOM, and `asChild` composition keeps working.
 *
 * Tone: `soft` and `solid` derive every fill and border from `currentColor`, so
 * a single text color class (e.g. `text-success`) retints the whole tile. They
 * default to `text-primary`; override it to recolor without touching internals.
 */
const iconTileVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center align-middle",
    "size-(--icon-tile-size) rounded-(--icon-tile-radius)",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-(--icon-tile-icon-size)",
  ],
  {
    variants: {
      variant: {
        /** Plain bordered surface. The quiet default for list rows and toolbars. */
        outline: "border border-border bg-background dark:bg-input/32",
        /** Raised muted fill with a background-colored ring. Reads as a physical chip. */
        elevated:
          "border-2 border-background bg-muted text-accent-foreground shadow-[0_1px_3px_0_rgb(0_0_0/0.14)] dark:border",
        /**
         * Tinted double container: an opacity-filled outer ring with no border
         * around a bordered inner card, all derived from `currentColor`. The
         * quiet, colorful sibling of `frame`. Retint with a text color class.
         */
        soft: [
          "isolate p-(--icon-tile-inset) text-primary bg-current/10",
          "after:absolute after:-z-10 after:inset-(--icon-tile-inset)",
          "after:rounded-[calc(var(--icon-tile-radius)-var(--icon-tile-inset))]",
          "after:border after:border-current/20 after:bg-current/5",
        ],
        /** Filled tone with a contrasting glyph. Retint with `bg-*` + a text color. */
        solid: "bg-primary text-primary-foreground",
        /** Double container - a muted ring around an inset card, matching Frame. */
        frame: [
          "isolate border border-border bg-muted/50 p-(--icon-tile-inset)",
          "after:absolute after:-z-10 after:inset-(--icon-tile-inset)",
          "after:rounded-[calc(var(--icon-tile-radius)-var(--icon-tile-inset))]",
          "after:border after:border-border after:bg-card after:shadow-xs",
        ],
      },
      size: {
        xs: "[--icon-tile-size:--spacing(6)] [--icon-tile-icon-size:--spacing(3.5)] [--icon-tile-inset:--spacing(0.5)]",
        sm: "[--icon-tile-size:--spacing(8)] [--icon-tile-icon-size:--spacing(4)] [--icon-tile-inset:--spacing(0.5)]",
        default:
          "[--icon-tile-size:--spacing(10)] [--icon-tile-icon-size:--spacing(4.5)] [--icon-tile-inset:--spacing(0.75)]",
        lg: "[--icon-tile-size:--spacing(12)] [--icon-tile-icon-size:--spacing(5.5)] [--icon-tile-inset:--spacing(0.75)]",
        xl: "[--icon-tile-size:--spacing(14)] [--icon-tile-icon-size:--spacing(7)] [--icon-tile-inset:--spacing(1)]",
      },
      /**
       * `default`: active style radius. `full`: circular.
       * The plain value is the fallback outside a style scope; the `style-*`
       * tokens win by specificity inside one, and survive the registry
       * transform as the single resolved value per generated style.
       */
      radius: {
        default:
          "[--icon-tile-radius:var(--radius-md)] style-vega:[--icon-tile-radius:var(--radius-md)] style-nova:[--icon-tile-radius:var(--radius-md)] style-maia:[--icon-tile-radius:var(--radius-2xl)] style-lyra:[--icon-tile-radius:0px] style-mira:[--icon-tile-radius:var(--radius-md)] style-luma:[--icon-tile-radius:var(--radius-2xl)] style-rhea:[--icon-tile-radius:var(--radius-2xl)] style-sera:[--icon-tile-radius:0px]",
        full: "[--icon-tile-radius:calc(infinity*1px)]",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
      radius: "default",
    },
  }
)

interface IconTileProps
  extends React.ComponentProps<"span">, VariantProps<typeof iconTileVariants> {
  asChild?: boolean
}

function IconTile({
  className,
  variant = "outline",
  size = "default",
  radius = "default",
  asChild = false,
  ...props
}: IconTileProps) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="icon-tile"
      data-variant={variant}
      data-size={size}
      className={cn(iconTileVariants({ variant, size, radius, className }))}
      {...props}
    />
  )
}

export { IconTile, iconTileVariants, type IconTileProps }
