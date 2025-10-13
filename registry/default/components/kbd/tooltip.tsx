import { Button } from '@/registry/default/ui/button';
import { Kbd, KbdGroup } from '@/registry/default/ui/kbd';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/default/ui/tooltip';

export default function KbdTooltip() {
  return (
    <div className="flex flex-wrap gap-2.5">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" variant="outline">
            Save
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            Save Changes <Kbd>S</Kbd>
          </div>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" variant="outline">
            Print
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            Print Document{' '}
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>P</Kbd>
            </KbdGroup>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
