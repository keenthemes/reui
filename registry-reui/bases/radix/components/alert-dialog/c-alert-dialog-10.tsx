import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/bases/radix/ui/alert-dialog"
import { Button } from "@/registry/bases/radix/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">View Confirmation</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="gap-8 p-8 sm:max-w-sm">
        <div className="mx-auto flex flex-col items-center justify-center gap-2">
          <AlertDialogMedia className="bg-info/10 text-info dark:bg-info/20 size-16 rounded-full">
            <IconPlaceholder
              lucide="CheckIcon"
              tabler="IconCheck"
              hugeicons="Tick02Icon"
              phosphor="CheckIcon"
              remixicon="RiCheckLine"
              className="size-5"
            />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-center">
            Success! Your e-ticket is registered.
          </AlertDialogTitle>
          <AlertDialogDescription className="max-w-xs text-center">
            Please check your email for confirmation and further instructions
            about the event.
          </AlertDialogDescription>
        </div>

        <div className="bg-muted/60 grid gap-4 rounded-xl p-4">
          {[
            ["Order Number", "GBD99763JS"],
            ["Order Date", "7 September 2024"],
            ["Event Name", "Groove Beats Day Fest"],
            ["Event Date", "20/09/2024"],
            ["Register Date", "20/09/2024 | 09 PM"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground font-medium">{label}</span>
              <span className="text-foreground font-semibold">{value}</span>
            </div>
          ))}
        </div>

        {/* The footer's built-in `-mx-4 -mb-4` cancels the content's DEFAULT
            `p-4`. This dialog uses `p-8`, so the breakout has to match it -
            otherwise the bar (and its top border) stops 1rem short on each
            side. `px-8` keeps the button aligned with the body above. */}
        <AlertDialogFooter className="-mx-8 -mb-8 px-8">
          <AlertDialogCancel
            size="lg"
            variant="default"
            className="w-full sm:w-full"
          >
            Back to Home
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
