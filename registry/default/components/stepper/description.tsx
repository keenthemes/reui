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

const steps = [1, 2, 3, 4];

export default function Component() {
  return (
    <Stepper defaultValue={2} className="space-y-8">
      <StepperNav>
        {steps.map((step) => (
          <StepperItem key={step} step={step}>
            <StepperTrigger>
              <StepperIndicator>{step}</StepperIndicator>
            </StepperTrigger>
            {steps.length > step && <StepperSeparator />}
          </StepperItem>
        ))}
      </StepperNav>

      <StepperPanel className="text-sm">
        {steps.map((step) => (
          <StepperContent key={step} value={step} className="flex items-center justify-center">
            Step {step} content
          </StepperContent>
        ))}
      </StepperPanel>
    </Stepper>
  );
}
