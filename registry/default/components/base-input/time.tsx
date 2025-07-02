'use client';

import { DateInput, TimeField } from '@/registry/default/ui/datefield';
import { InputAddon, InputGroup, InputWrapper } from '@/registry/default/ui/base-input';
import { Clock3 } from 'lucide-react';

export default function InputDemo() {
  return (
    <div className="flex flex-col gap-5">
      <div className="w-80">
        <TimeField>
          <DateInput />
        </TimeField>
      </div>
      <div className="w-80">
        <InputGroup>
          <InputAddon mode="icon">
            <Clock3 />
          </InputAddon>
          <TimeField>
            <DateInput />
          </TimeField>
        </InputGroup>
      </div>
      <div className="w-80">
        <InputGroup>
          <TimeField>
            <DateInput />
          </TimeField>
          <InputAddon mode="icon">
            <Clock3 />
          </InputAddon>
        </InputGroup>
      </div>
      <div className="w-80">
        <InputWrapper>
          <TimeField>
            <DateInput />
          </TimeField>
          <Clock3 />
        </InputWrapper>
      </div>
      <div className="w-80">
        <InputWrapper>
          <Clock3 />
          <TimeField>
            <DateInput />
          </TimeField>
        </InputWrapper>
      </div>
    </div>
  );
}
