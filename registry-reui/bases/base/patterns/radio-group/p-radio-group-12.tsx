// Description: Avatar based card radio group
// Order: 12

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Field, FieldLabel, FieldTitle } from "@/registry/bases/base/ui/field"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/bases/base/ui/radio-group"

export default function Pattern() {
  return (
    <RadioGroup defaultValue="emma" className="w-full max-w-xs">
      <FieldLabel htmlFor="emma-wilson" className="p-0!">
        <Field orientation="horizontal">
          <FieldTitle className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop"
                alt="Emma Wilson"
              />
              <AvatarFallback>EW</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold">Emma Wilson</span>
              <span className="text-muted-foreground text-xs">@emmawilson</span>
            </div>
          </FieldTitle>
          <RadioGroupItem value="emma" id="emma-wilson" />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="john-doe" className="p-0!">
        <Field orientation="horizontal">
          <FieldTitle className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop"
                alt="John Doe"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold">John Doe</span>
              <span className="text-muted-foreground text-xs">@johndoe</span>
            </div>
          </FieldTitle>
          <RadioGroupItem value="john" id="john-doe" />
        </Field>
      </FieldLabel>
    </RadioGroup>
  )
}
