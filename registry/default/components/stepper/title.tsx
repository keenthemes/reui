import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
  StepperContent,
  StepperPanel,
  StepperNav,
  StepperTitle,
} from '@/registry/default/ui/stepper';

const steps = [
  {title: 'Step 1', description: 'Description 1'}, 
  {title: 'Step 2', description: 'Description 2'}, 
  {title: 'Step 3', description: 'Description 3'}, 
  {title: 'Step 4', description: 'Description 4'}
];

export default function Component() {
  return (
    <Stepper defaultValue={2} className="space-y-8">
      <StepperNav>
        {steps.map((step, index) => (
          <StepperItem key={index} step={index + 1}>
            <div className="flex flex-col items-center gap-2">
              <StepperTrigger>
                <StepperIndicator>{index + 1}</StepperIndicator>
              </StepperTrigger>
              <StepperTitle>
                {step.title}
              </StepperTitle>
            </div>
            
            {steps.length > index + 1 && <StepperSeparator />}
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
