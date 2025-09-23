import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/default/ui/avatar';
import {
  Select,
  SelectClear,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/base-select';

interface Item {
  label: string;
  avatar: string;
  value: string;
}

const items: Item[] = [
  {
    label: 'Alan Bold',
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    value: '1',
  },
  {
    label: 'Ethan James',
    avatar: 'https://randomuser.me/api/portraits/men/29.jpg',
    value: '2',
  },
  {
    label: 'Nina Clark',
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
    value: '3',
  },
  {
    label: 'Sean Otto',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    value: '4',
  },
];

export default function BaseSelectDemo() {
  const [value, setValue] = useState<string | null>(null);

  const renderValue = (item: Item | null) => {
    return item ? (
      <span className="flex items-center gap-2">
        <Avatar className="size-5">
          <AvatarImage src={item.avatar} alt="@reui" />
          <AvatarFallback>{item.label.charAt(0)}</AvatarFallback>
        </Avatar>
        <span>{item.label}</span>
      </span>
    ) : (
      <span>Select a user</span>
    );
  };

  const selectedItem = items.find((item) => item.value === value) || null;

  return (
    <Select value={value} onValueChange={(value) => setValue(value as string | null)} indicatorPosition="right">
      <SelectTrigger className="w-60">
        <SelectValue>{renderValue(selectedItem)}</SelectValue>
        {value && <SelectClear onClick={() => setValue(null)} />}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="text-xs py-1 font-normal text-muted-foreground ps-2">Select a user</SelectLabel>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              <span className="flex items-center gap-2">
                <Avatar className="size-6">
                  <AvatarImage src={item.avatar} alt="@reui" />
                  <AvatarFallback>{item.label.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{item.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
