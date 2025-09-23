import { Button } from '@/registry/default/ui/base-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/registry/default/ui/base-tooltip';
import { Info } from 'lucide-react';

export default function BaseTooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          <Info className="h-4 w-4" />
          Default tooltip
        </TooltipTrigger>
        <TooltipContent>
          <p>Get detailed information about this feature.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
