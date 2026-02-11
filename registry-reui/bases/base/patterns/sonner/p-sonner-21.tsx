// Description: Updatable toast with ID
// Order: 21

"use client"

import { useRef } from "react"
import { toast } from "sonner"

import { Button } from "@/registry/bases/base/ui/button"
import { Spinner } from "@/registry/bases/base/ui/spinner"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function LoadingToast({ message }: { message: string }) {
  return (
    <div className="bg-popover text-popover-foreground border-border style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-3xl style-mira:rounded-md flex w-[356px] items-center gap-3 border p-4 shadow-lg">
      <Spinner className="size-4 opacity-60" />
      <p className="text-xs font-medium">{message}</p>
    </div>
  )
}

function SuccessToast() {
  return (
    <div className="bg-popover text-popover-foreground border-border style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-3xl style-mira:rounded-md flex w-[356px] items-start gap-3 border p-4 shadow-lg">
      <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
        <IconPlaceholder
          lucide="CheckIcon"
          tabler="IconCheck"
          hugeicons="Tick02Icon"
          phosphor="CheckIcon"
          remixicon="RiCheckLine"
          className="size-3"
        />
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-xs font-semibold">Upload complete!</p>
        <p className="text-muted-foreground text-xs">
          3 files uploaded successfully.
        </p>
      </div>
    </div>
  )
}

export default function Pattern() {
  const toastId = useRef<string | number | undefined>(undefined)

  const startProgress = () => {
    toastId.current = toast.custom(
      () => <LoadingToast message="Preparing upload..." />,
      { duration: Infinity }
    )

    setTimeout(() => {
      toast.custom(() => <LoadingToast message="Uploading files... 30%" />, {
        id: toastId.current,
        duration: Infinity,
      })
    }, 1000)

    setTimeout(() => {
      toast.custom(() => <LoadingToast message="Uploading files... 70%" />, {
        id: toastId.current,
        duration: Infinity,
      })
    }, 2000)

    setTimeout(() => {
      toast.custom(() => <SuccessToast />, {
        id: toastId.current,
        duration: 4000,
      })
    }, 3000)
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={startProgress} variant="outline" className="w-fit">
        Updatable Toast
      </Button>
    </div>
  )
}
