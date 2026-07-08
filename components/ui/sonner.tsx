"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // Compact status icons (`size-3` = 12px) — small enough to
      // sit visually centred with a single-line title and not
      // dominate the row. The toast layout uses `!items-center`
      // (see `toastOptions.classNames.toast` below), so the icon
      // and the title share the same horizontal axis without
      // needing a per-icon top-margin offset.
      //
      // Per-status colour is baked into the icon JSX rather than
      // the toast surface. The bubble itself stays popover-coloured
      // (neutral) for every status, but the icon picks up the
      // semantic green/red/amber/blue — that way `toast.success`
      // reads as confirmation at a glance without turning the whole
      // toast into a green slab.
      icons={{
        success: (
          <CircleCheckIcon className="size-3 text-green-600 dark:text-green-400" />
        ),
        info: <InfoIcon className="size-3 text-sky-600 dark:text-sky-400" />,
        warning: (
          <TriangleAlertIcon className="size-3 text-amber-600 dark:text-amber-400" />
        ),
        error: (
          <OctagonXIcon className="size-3 text-red-600 dark:text-red-400" />
        ),
        loading: (
          <Loader2Icon className="text-site-muted-foreground size-3 animate-spin" />
        ),
      }}
      toastOptions={{
        // Dense, vertically-centred layout shared by every toast
        // variant (success, error, info, warning, loading,
        // default). Standardizing here so consumers don't pass
        // per-call class overrides.
        //
        //   • `!items-center` puts the icon on the same horizontal
        //     axis as the title — for the common single-line toast
        //     ("Added to favorites") this is the cleanest look.
        //     For toasts with a description, the icon sits at the
        //     vertical centre of the title + description block,
        //     which still reads as "this icon belongs to this
        //     message".
        //   • `!py-2 !px-3` (8px / 12px) trims the default
        //     Sonner padding without making the bubble feel
        //     cramped against the rounded corner.
        //   • `!gap-2` (8px) pairs with the smaller `size-3` icon
        //     for a balanced icon→title rhythm.
        //   • `!ms-0 !me-0` on the icon zeros Sonner's built-in
        //     `--toast-icon-margin-start: -3px` /
        //     `--toast-icon-margin-end: 4px` so the flex `gap`
        //     above is the actual rendered spacing rather than
        //     additive with library defaults.
        //   • `description` uses `leading-snug` (1.375) so a
        //     short two-line description doesn't push the bubble
        //     taller than necessary.
        classNames: {
          toast: "!gap-2 !py-2 !px-3 !items-center",
          title: "!text-sm !font-medium !leading-snug",
          description: "!text-xs !leading-snug",
          icon: "!ms-0 !me-0",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          // Force every status variant (success, error, info,
          // warning) to render with the same neutral surface as
          // the default toast. Sonner otherwise tints the whole
          // bubble for typed toasts, which conflicts with our
          // "neutral surface + coloured icon only" pattern.
          "--success-bg": "var(--popover)",
          "--success-text": "var(--popover-foreground)",
          "--success-border": "var(--border)",
          "--error-bg": "var(--popover)",
          "--error-text": "var(--popover-foreground)",
          "--error-border": "var(--border)",
          "--info-bg": "var(--popover)",
          "--info-text": "var(--popover-foreground)",
          "--info-border": "var(--border)",
          "--warning-bg": "var(--popover)",
          "--warning-text": "var(--popover-foreground)",
          "--warning-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
