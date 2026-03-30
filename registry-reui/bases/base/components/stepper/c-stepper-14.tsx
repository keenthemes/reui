// Description: Stepper with vertical orientation
// Order: 14
// GridSize: 1

"use client"

import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
} from "@/registry-reui/bases/base/reui/stepper"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const steps = [1, 2, 3]

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Stepper
        className="flex flex-col items-center justify-center gap-10"
        defaultValue={2}
        orientation="vertical"
        indicators={{
          completed: (
            <IconPlaceholder
              lucide="CheckIcon"
              tabler="IconCheck"
              hugeicons="Tick02Icon"
              phosphor="CheckIcon"
              remixicon="RiCheckLine"
              className="size-3.5"
            />
          ),
          loading: (
            <IconPlaceholder
              lucide="LoaderCircleIcon"
              tabler="IconLoader2"
              hugeicons="Loading02Icon"
              phosphor="CircleNotchIcon"
              remixicon="RiLoader4Line"
              className="size-3.5 animate-spin"
            />
          ),
        }}
      >
        <StepperNav>
          {steps.map((step) => (
            <StepperItem key={step} step={step} loading={step === 2}>
              <StepperTrigger>
                <StepperIndicator className="data-[state=completed]:bg-success data-[state=completed]:text-white">
                  {step}
                </StepperIndicator>
              </StepperTrigger>
              {steps.length > step && (
                <StepperSeparator className="group-data-[state=completed]/step:bg-success" />
              )}
            </StepperItem>
          ))}
        </StepperNav>

        <StepperPanel className="w-56 text-center text-sm">
          {steps.map((step) => (
            <StepperContent key={step} value={step}>
              Step {step} content
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  )
}
