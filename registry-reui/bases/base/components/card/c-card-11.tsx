// Description: Card with stacked depth effect
// Order: 11

import { Button } from "@/registry/bases/base/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"

export default function Pattern() {
  return (
    <div className="relative size-fit">
      {/* Card */}
      <Card className="relative z-1 w-full max-w-xs">
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
          <CardDescription>
            This card uses the default size variant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            The card component supports a size prop that defaults to
            &quot;default&quot; for standard spacing and sizing.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Action
          </Button>
        </CardFooter>
      </Card>
      {/* Depth effect */}
      <div className="bg-card style-vega:rounded-lg style-nova:rounded-lg style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md absolute inset-4 -bottom-3 z-0 border shadow-md shadow-black/1" />
      <div className="bg-card style-vega:rounded-lg style-nova:rounded-lg style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md absolute inset-2 -bottom-1.5 z-0 border shadow-md shadow-black/1" />
    </div>
  )
}
