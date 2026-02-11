// Description: Card with border separation
// Order: 3

import { Button } from "@/registry/bases/base/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"

export default function Pattern() {
  return (
    <Card className="w-full max-w-xs gap-0 p-0">
      <CardHeader className="flex items-center justify-between px-4 py-2">
        <CardTitle>Header</CardTitle>
        <CardAction>
          <Button variant="outline" className="w-full">
            Action
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="border-y px-4 py-3">
        <p>
          The footer has a border-t class applied, creating a visual separation
          between the content and footer sections.
        </p>
      </CardContent>
      <CardFooter className="border-none px-4 py-3">
        <Button variant="outline" className="w-full">
          Action
        </Button>
      </CardFooter>
    </Card>
  )
}
