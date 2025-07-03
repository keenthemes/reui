import { Button } from '@/registry/default/ui/button';
import { PanelRightOpen } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/default/ui/tooltip';

export default function BlocksNavToggle() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="-ms-0.5">
          <PanelRightOpen/>
        </Button>
      </TooltipTrigger>
      <TooltipContent  align="center" side="right">Toggle navigation</TooltipContent>
    </Tooltip>
  );
}
