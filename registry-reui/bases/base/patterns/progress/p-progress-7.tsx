// Description: Multi-step progress indicator
// Order: 7

import { Progress } from "@/registry/bases/base/ui/progress"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const steps = [
  { label: "Account", completed: true },
  { label: "Profile", completed: true },
  { label: "Preferences", completed: false },
  { label: "Review", completed: false },
]

export default function Pattern() {
  const completedSteps = steps.filter((s) => s.completed).length
  const progressValue = (completedSteps / steps.length) * 100

  return (
    <div className="mx-auto w-full max-w-xs space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Setup Progress</span>
        <span className="text-muted-foreground text-xs">
          {completedSteps} of {steps.length} steps
        </span>
      </div>
      <Progress value={progressValue} />
      <div className="flex flex-col gap-2">
        {steps.map((step) => (
          <div key={step.label} className="flex items-center gap-2 text-sm">
            {step.completed ? (
              <IconPlaceholder
                lucide="CircleCheckIcon"
                tabler="IconCircleCheck"
                hugeicons="CheckmarkCircle01Icon"
                phosphor="CheckCircleIcon"
                remixicon="RiCheckboxCircleLine"
                className="text-success size-4"
                aria-hidden="true"
              />
            ) : (
              <IconPlaceholder
                lucide="CircleIcon"
                tabler="IconCircle"
                hugeicons="CircleIcon"
                phosphor="CircleIcon"
                remixicon="RiCircleLine"
                className="text-muted-foreground size-4"
                aria-hidden="true"
              />
            )}
            <span
              className={
                step.completed ? "text-foreground" : "text-muted-foreground"
              }
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
