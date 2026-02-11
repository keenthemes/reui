// Description: Confirmation for successful e-ticket registration
// Order: 10

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/bases/base/ui/alert-dialog"
import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="outline">View Confirmation</Button>}
      />
      <AlertDialogContent className="gap-8 p-8 sm:max-w-sm">
        <div className="mx-auto flex flex-col items-center justify-center gap-2">
          <AlertDialogMedia className="bg-info/10 text-info dark:bg-info/20 style-vega:rounded-full style-nova:rounded-full style-lyra:rounded-none style-maia:rounded-full style-mira:rounded-full size-16">
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

        <div className="bg-muted/60 style-vega:rounded-xl style-nova:rounded-xl style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md grid gap-4 p-4">
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

        <AlertDialogFooter>
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
