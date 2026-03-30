// Description: Advanced security audit confirmation
// Order: 14

import { Badge } from "@/registry-reui/bases/base/reui/badge"

import {
  AlertDialog,
  AlertDialogAction,
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

const SECURITY_ITEMS = [
  {
    icon: (
      <IconPlaceholder
        lucide="LockIcon"
        tabler="IconLock"
        hugeicons="SquareLock01Icon"
        phosphor="LockSimpleIcon"
        remixicon="RiLockLine"
        className="text-muted-foreground size-4"
      />
    ),
    title: "Password Policy",
    description: "Verify strength and rotation",
    status: "Pending",
  },
  {
    icon: (
      <IconPlaceholder
        lucide="FingerprintPatternIcon"
        tabler="IconFingerprint"
        hugeicons="FingerPrintIcon"
        phosphor="FingerprintIcon"
        remixicon="RiFingerprintLine"
        className="text-muted-foreground size-4"
      />
    ),
    title: "Biometric Status",
    description: "Check hardware encryption",
    status: "Done",
  },
  {
    icon: (
      <IconPlaceholder
        lucide="KeySquareIcon"
        tabler="IconKey"
        hugeicons="Key02Icon"
        phosphor="KeyIcon"
        remixicon="RiKeyLine"
        className="text-muted-foreground size-4"
      />
    ),
    title: "Active Sessions",
    description: "Review connected devices",
    status: "Pending",
  },
]

export default function Pattern() {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="outline">Advanced Security Check</Button>}
      />
      <AlertDialogContent className="max-w-sm! gap-0 overflow-hidden p-0">
        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-1.5 px-4 pt-6 pb-5 text-center">
          <AlertDialogMedia className="style-vega:rounded-full style-nova:rounded-full style-lyra:rounded-none style-maia:rounded-full style-mira:rounded-full size-12 bg-green-50 text-green-500 dark:bg-green-950 dark:text-green-400">
            <IconPlaceholder
              lucide="ShieldAlertIcon"
              tabler="IconShieldExclamation"
              hugeicons="ShieldEnergyIcon"
              phosphor="ShieldWarningIcon"
              remixicon="RiShieldLine"
              className="size-6"
            />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-base font-semibold">
            Advanced Security Audit
          </AlertDialogTitle>
          <AlertDialogDescription className="p-0 text-sm">
            Summary of your account status and security settings.
          </AlertDialogDescription>
        </div>

        {/* Content */}
        <div className="space-y-3 p-4">
          {SECURITY_ITEMS.map((item) => (
            <div
              key={item.title}
              className="border-border style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md flex items-center justify-between border border-dashed px-3 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <div className="bg-background border-border/80 style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md flex size-8 items-center justify-center border shadow-xs">
                  {item.icon}
                </div>
                <div className="flex flex-col gap-0.25">
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="text-muted-foreground text-xs">
                    {item.description}
                  </span>
                </div>
              </div>
              <Badge
                variant={
                  item.status === "Pending" ? "warning-light" : "success-light"
                }
              >
                {item.status}
              </Badge>
            </div>
          ))}
        </div>

        {/* Footer */}
        <AlertDialogFooter className="grid grid-cols-1 gap-2 p-4">
          <AlertDialogAction variant="default" className="flex-1">
            Start Deep Audit
          </AlertDialogAction>
          <AlertDialogCancel variant="ghost" className="flex-1">
            Skip for now
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
