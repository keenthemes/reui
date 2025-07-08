import { Button } from '@/registry/default/ui/button';
import { PanelRightOpen } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/default/ui/tooltip';

export default function BlocksNavToggle() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="-ms-2 size-8">
          <PanelRightOpen/>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Toggle sidebar navigation</TooltipContent>
    </Tooltip>
  );
}
