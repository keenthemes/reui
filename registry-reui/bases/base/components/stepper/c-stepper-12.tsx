// Description: Stepper with segmented progress bar
// Order: 12
// GridSize: 1

"use client"

import { useState } from "react"
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperTrigger,
} from "@/registry-reui/bases/base/reui/stepper"

import { cn } from "@/registry/bases/base/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const steps = [1, 2, 3, 4]

export default function Pattern() {
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <div className="w-full max-w-md">
      <Stepper value={currentStep} onValueChange={setCurrentStep}>
        <StepperNav>
          {steps.map((step) => (
            <StepperItem
              key={step}
              step={step}
              className="style-vega:first:rounded-s-full style-vega:last:rounded-e-full style-maia:first:rounded-s-full style-maia:last:rounded-e-full style-nova:first:rounded-s-full style-nova:last:rounded-e-full style-lyra:first:rounded-s-none style-lyra:last:rounded-e-none style-mira:first:rounded-s-full style-mira:last:rounded-e-full flex-1 overflow-hidden transition-all duration-300"
            >
              <StepperTrigger
                className="w-full flex-col items-start gap-2"
                asChild
              >
                <StepperIndicator className="bg-border h-2 w-full rounded-none!">
                  <span className="sr-only">{step}</span>
                </StepperIndicator>
              </StepperTrigger>
            </StepperItem>
          ))}
        </StepperNav>

        <div className="flex items-center justify-between gap-2.5 py-1">
          <Button
            variant="link"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className={cn(
              "px-0",
              currentStep === 1 && "pointer-events-none opacity-0"
            )}
          >
            <IconPlaceholder
              lucide="ArrowLeftIcon"
              tabler="IconArrowLeft"
              hugeicons="ArrowLeft01Icon"
              phosphor="ArrowLeftIcon"
              remixicon="RiArrowLeftLine"
              className="size-4"
            />
            Back
          </Button>

          <div className="text-sm font-medium">
            <span className="text-foreground">{currentStep}</span>{" "}
            <span className="text-muted-foreground/60">/ {steps.length}</span>
          </div>
        </div>

        <StepperPanel className="py-6 text-sm">
          {steps.map((step) => (
            <StepperContent
              className="flex w-full items-center justify-center"
              key={step}
              value={step}
            >
              Step {step} content
            </StepperContent>
          ))}
        </StepperPanel>

        <div className="flex items-center justify-end gap-2.5">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => prev + 1)}
            disabled={currentStep === steps.length}
          >
            Next
          </Button>
        </div>
      </Stepper>
    </div>
  )
}
