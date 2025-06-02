import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
  StepperContent,
  StepperPanel,
  StepperNav,
} from '@/registry/default/ui/stepper';
import { Button } from '@/registry/default/ui/button';
import { useState } from 'react';

const steps = [1, 2, 3, 4];

export default function Component() {
  const [currentStep, setCurrentStep] = useState(2);

  return (
    <Stepper value={currentStep} onValueChange={setCurrentStep} className="space-y-8">
      <StepperNav>
        {steps.map((step) => (
          <StepperItem key={step} step={step}>
            <StepperTrigger>
              <StepperIndicator className="data-[state=completed]:bg-green-500 data-[state=completed]:text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-gray-500">
                {step}
              </StepperIndicator>
            </StepperTrigger>
            {steps.length > step && <StepperSeparator />}
          </StepperItem>
        ))}
      </StepperNav>

      <StepperPanel className="text-sm">
        {steps.map((step) => (
          <StepperContent className="w-full flex items-center justify-center" key={step} value={step}>
            Step {step} content
          </StepperContent>
        ))}
      </StepperPanel>

      <div className="flex items-center justify-between gap-2.5">
        <Button variant="outline" onClick={() => setCurrentStep((prev) => prev - 1)} disabled={currentStep === 1}>Previous</Button>
        <Button variant="outline" onClick={() => setCurrentStep((prev) => prev + 1)} disabled={currentStep === steps.length}>Next</Button>
      </div>
    </Stepper>
  );
}
