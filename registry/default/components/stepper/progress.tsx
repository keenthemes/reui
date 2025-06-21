import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/registry/default/ui/stepper';
import { Check, LoaderCircleIcon } from 'lucide-react';

const steps = [
  { title: 'Step 1', description: 'Description 1' },
  { title: 'Step 2', description: 'Description 2' },
  { title: 'Step 3', description: 'Description 3' },
  { title: 'Step 4', description: 'Description 4' },
];

export default function Component() {
  return (
    <Stepper
      defaultValue={2}
      indicators={{
        completed: <Check className="size-4" />,
        loading: <LoaderCircleIcon className="size-4 animate-spin" />,
      }}
      className="space-y-8"
    >
      <StepperNav>
        {steps.map((step, index) => (
          <StepperItem key={index} step={index + 1}>
            <div className="flex flex-col items-center gap-2">
              <StepperTrigger>
                <StepperIndicator>{index + 1}</StepperIndicator>
              </StepperTrigger>
              <StepperTitle>{step.title}</StepperTitle>
            </div>

            {steps.length > index + 1 && <StepperSeparator className="-mt-5" />}
          </StepperItem>
        ))}
      </StepperNav>

      <StepperPanel className="text-sm">
        {steps.map((step, index) => (
          <StepperContent key={index} value={index + 1} className="flex items-center justify-center">
            Step {step.title} content
          </StepperContent>
        ))}
      </StepperPanel>
    </Stepper>
  );
}
