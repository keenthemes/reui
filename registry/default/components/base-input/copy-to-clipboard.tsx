import { useRef } from 'react';
import { useCopyToClipboard } from '@/registry/default/hooks/use-copy-to-clipboard';
import { Button } from '@/registry/default/ui/base-button';
import { Input, InputWrapper } from '@/registry/default/ui/base-input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/registry/default/ui/tooltip';
import { CheckIcon, CopyIcon } from 'lucide-react';

export default function InputDemo() {
  const { copy, copied } = useCopyToClipboard();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (inputRef.current) {
      copy(inputRef.current.value);
    }
  };

  return (
    <div className="w-80">
      <InputWrapper>
        <Input
          type="email"
          placeholder="Copy to clipboard"
          defaultValue="pnpm install @keenthemes/reui"
          ref={inputRef}
        />
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleCopy} variant="dim" disabled={copied} className="-me-3.5">
                {copied ? <CheckIcon className="stroke-green-600" size={16} /> : <CopyIcon size={16} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs">Copy to clipboard</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </InputWrapper>
    </div>
  );
}
