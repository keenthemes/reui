import { Button } from '@/registry/default/ui/base-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/registry/default/ui/base-tooltip';

export default function BaseTooltipWithoutArrowDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>Display Tooltip</TooltipTrigger>
        <TooltipContent showArrow>
          <p>Get detailed information about this feature.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
