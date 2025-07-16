import React, { useState } from 'react';
import { Button } from '@/registry/default/ui/button';
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperTrigger,
} from '@/registry/default/ui/stepper';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StepperProgress() {
  const steps = [1, 2, 3, 4];
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="w-full flex flex-col">
      <Stepper value={currentStep} onValueChange={setCurrentStep}>
        <StepperNav>
          {steps.map((step) => (
            <StepperItem
              key={step}
              step={step}
              className="flex-1 first:rounded-s-full last:rounded-e-full overflow-hidden transition-all duration-300"
            >
              <StepperTrigger className="w-full flex-col items-start gap-2" asChild>
                <StepperIndicator className="bg-border h-2 w-full rounded-none">
                  <span className="sr-only">{step}</span>
                </StepperIndicator>
              </StepperTrigger>
            </StepperItem>
          ))}
        </StepperNav>

        <div className="flex items-center justify-between gap-2.5 py-2">
          <Button
            mode="link"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className={cn(currentStep === 1 && 'pointer-events-none opacity-0')}
          >
            <ArrowLeft /> Back
          </Button>

          <div className="text-sm font-medium">
            <span className="text-foreground">{currentStep}</span>{' '}
            <span className="text-muted-foreground/60">/ {steps.length}</span>
          </div>
        </div>

        <StepperPanel className="text-sm py-12">
          {steps.map((step) => (
            <StepperContent className="w-full flex items-center justify-center" key={step} value={step}>
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
  );
}
