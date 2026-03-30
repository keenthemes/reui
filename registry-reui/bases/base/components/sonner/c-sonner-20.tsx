// Description: Custom integration toast
// Order: 20

import { toast } from "sonner"

import { Button } from "@/registry/bases/base/ui/button"
import { Separator } from "@/registry/bases/base/ui/separator"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const showToast = () => {
    toast.custom(() => (
      <div className="bg-popover text-popover-foreground border-border style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-3xl style-mira:rounded-md flex w-[356px] flex-col gap-3 border p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="style-vega:rounded-lg style-nova:rounded-lg style-lyra:rounded-none style-maia:rounded-3xl style-mira:rounded-lg flex size-10 shrink-0 items-center justify-center bg-linear-to-br from-violet-500 to-purple-600 text-white shadow-sm">
            <IconPlaceholder
              lucide="LinkIcon"
              tabler="IconLink"
              hugeicons="Link01Icon"
              phosphor="LinkIcon"
              remixicon="RiLinkM"
              className="size-5"
              aria-hidden="true"
            />
          </div>
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-sm font-semibold">Integration Connected</p>
            <p className="text-muted-foreground text-xs">workspace.slack.com</p>
          </div>
          <span className="flex items-center gap-1 text-xs text-green-600">
            <span className="size-1.5 rounded-full bg-green-500" />
            Active
          </span>
        </div>
        <Separator />
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>Syncing 3 channels</span>
          <span>Last sync: just now</span>
        </div>
        <div className="flex gap-2">
          <Button
            size="xs"
            variant="outline"
            className="flex-1"
            onClick={() => toast.dismiss()}
          >
            <IconPlaceholder
              lucide="SettingsIcon"
              tabler="IconSettings"
              hugeicons="SettingsIcon"
              phosphor="GearIcon"
              remixicon="RiSettings3Line"
              className="size-3"
              aria-hidden="true"
            />
            Configure
          </Button>
          <Button size="xs" className="flex-1" onClick={() => toast.dismiss()}>
            Open Dashboard
          </Button>
        </div>
      </div>
    ))
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={showToast} variant="outline" className="w-fit">
        Integration Toast
      </Button>
    </div>
  )
}
