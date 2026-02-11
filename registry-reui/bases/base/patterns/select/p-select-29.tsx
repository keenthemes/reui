// Description: Select with avatar items for team member assignment
// Order: 29

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Field } from "@/registry/bases/base/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"

const members = [
  {
    value: "sarah",
    label: "Sarah Chen",
    initials: "SC",
    avatar:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
  },
  {
    value: "alex",
    label: "Alex Kim",
    initials: "AK",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
  },
  {
    value: "maria",
    label: "Maria Garcia",
    initials: "MG",
    avatar:
      "https://images.unsplash.com/photo-1620075225255-8c2051b6c015?w=96&h=96&dpr=2&q=80",
  },
  {
    value: "james",
    label: "James Wilson",
    initials: "JW",
    avatar:
      "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80",
  },
]

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <Select defaultValue={members[0]} items={members}>
        <SelectTrigger>
          <SelectValue>
            {(item: (typeof members)[number]) => (
              <span className="flex items-center gap-2">
                <Avatar className="size-5">
                  <AvatarImage src={item?.avatar} alt={item?.label} />
                  <AvatarFallback className="text-[10px]">
                    {item?.initials}
                  </AvatarFallback>
                </Avatar>
                <span>{item?.label}</span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            <SelectLabel>Assign to</SelectLabel>
            {members.map((member) => (
              <SelectItem key={member.value} value={member}>
                <span className="flex items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarImage src={member.avatar} alt={member.label} />
                    <AvatarFallback className="text-xs">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span>{member.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
