// Description: Basic item with title and description
// Order: 1

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/registry/bases/base/ui/item"

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-2">
      <Item>
        <ItemContent>
          <ItemTitle>Default Item</ItemTitle>
          <ItemDescription>
            A simple item with title and description.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Outline Item</ItemTitle>
          <ItemDescription>
            An outlined item with visible border.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Muted Item</ItemTitle>
          <ItemDescription>
            A muted item with subtle background.
          </ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}
