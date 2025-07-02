import { Button } from '@/registry/default/ui/base-button';
import { Input, InputWrapper } from '@/registry/default/ui/base-input';
import { Euro, TicketPercent, User, X } from 'lucide-react';

export default function InputDemo() {
  return (
    <div className="space-y-5 w-80">
      <InputWrapper>
        <Euro />
        <Input type="email" placeholder="Start icon" />
      </InputWrapper>
      <InputWrapper>
        <Input type="email" placeholder="End icon" />
        <TicketPercent />
      </InputWrapper>
      <InputWrapper>
        <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5">
          <User />
        </Button>
        <Input type="email" placeholder="Start clickble icon" />
      </InputWrapper>
      <InputWrapper>
        <Input type="email" placeholder="End clickble icon" />
        <Button size="sm" variant="dim" mode="icon" className="size-5 -me-0.5">
          <X />
        </Button>
      </InputWrapper>
    </div>
  );
}
