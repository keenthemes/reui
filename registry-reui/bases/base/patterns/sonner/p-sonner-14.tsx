// Description: Custom invert error toast with details
// Order: 14

import { toast } from "sonner"

import { Button } from "@/registry/bases/base/ui/button"
import { Separator } from "@/registry/bases/base/ui/separator"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const showToast = () => {
    toast.custom(() => (
      <div className="bg-invert text-invert-foreground style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-3xl style-mira:rounded-md flex w-[356px] flex-col gap-3 border border-transparent p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
            <IconPlaceholder
              lucide="XIcon"
              tabler="IconX"
              hugeicons="MultiplicationSignIcon"
              phosphor="XIcon"
              remixicon="RiCloseLine"
              className="size-3.5"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <p className="text-sm font-semibold">Build Failed</p>
            <p className="text-invert-foreground/70 text-sm">
              Compilation error in 2 files. Fix errors before deploying.
            </p>
          </div>
        </div>
        <Separator className="bg-border/10" />
        <div className="text-invert-foreground/60 space-y-1 font-mono text-xs">
          <p>src/api/auth.ts:42 — TypeError: undefined is not a function</p>
          <p>src/utils/parse.ts:18 — SyntaxError: Unexpected token</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="xs"
            variant="outline"
            className="bg-background/10 border-border/10 text-invert-foreground flex-1"
            onClick={() => toast.dismiss()}
          >
            View Logs
          </Button>
          <Button
            size="xs"
            className="flex-1 border-red-800 bg-red-500 text-white hover:border-red-900 hover:bg-red-600"
            onClick={() => toast.dismiss()}
          >
            Retry Build
          </Button>
        </div>
      </div>
    ))
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={showToast} variant="outline" className="w-fit">
        Invert Error Toast
      </Button>
    </div>
  )
}
