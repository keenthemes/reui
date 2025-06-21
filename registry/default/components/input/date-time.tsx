'use client';

import { DateField, DateInput } from '@/registry/default/ui/datefield';
import { InputWrapper } from '@/registry/default/ui/input';
import { CalendarDays } from 'lucide-react';

export default function InputDemo() {
  return (
    <div className="w-80">
      <InputWrapper>
        <CalendarDays />
        <DateField granularity="minute" hourCycle={24}>
          <DateInput />
        </DateField>
      </InputWrapper>
    </div>
  );
}
