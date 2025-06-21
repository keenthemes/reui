import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
} from '@/registry/default/ui/stepper';
import { Check, LoaderCircleIcon } from 'lucide-react';

const steps = [1, 2, 3];

export default function Component() {
  return (
    <Stepper
      defaultValue={2}
      indicators={{
        completed: <Check className="size-3.5" />,
        loading: <LoaderCircleIcon className="size-3.5 animate-spin" />,
      }}
    >
      <StepperNav className="mb-5">
        {steps.map((step) => (
          <StepperItem key={step} step={step} loading={step === 2}>
            <StepperTrigger>
              <StepperIndicator className="size-5 border-2 data-[state=completed]:bg-green-500 data-[state=completed]:border-green-500 data-[state=completed]:text-white data-[state=active]:text-primary-foreground data-[state=active]:bg-primary data-[state=active]:border-primary data-[state=inactive]:border-muted">
                <span className="hidden size-1.5 rounded-full bg-primary-foreground group-data-[state=active]/step:block"></span>
              </StepperIndicator>
            </StepperTrigger>
            {steps.length > step && <StepperSeparator className="group-data-[state=completed]/step:bg-green-500" />}
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
