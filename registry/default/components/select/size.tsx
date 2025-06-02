'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/default/ui/select';

export default function SelectDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Select>
        <SelectTrigger size="sm" className="w-[200px]">
          <SelectValue placeholder="Small" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="grape">Grape</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Medium" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="grape">Grape</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger size="lg" className="w-[200px]">
          <SelectValue placeholder="Large" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="grape">Grape</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
