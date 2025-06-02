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
import { Check, LoaderCircleIcon } from 'lucide-react';

const steps = [1, 2, 3];

export default function Component() {
  return (
    <Stepper defaultValue={2} className="space-y-8"
      indicators={{
        completed: <Check className="size-4" />,
        loading: <LoaderCircleIcon className="size-4 animate-spin" />,
      }}
    >
      <StepperNav>
        {steps.map((step) => (
          <StepperItem key={step} step={step} loading={step === 2}>
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
    </Stepper>
  );
}
