// Description: Card with link
// Order: 5

import { Button } from "@/registry/bases/base/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Card className="w-full max-w-xs gap-2 pt-5">
      <CardHeader>
        <CardTitle>Need a help in Claim?</CardTitle>
      </CardHeader>
      <CardContent className="mb-2">
        <p>
          Go to this step by step guideline process on how to certify for your
          weekly benefits:
        </p>
      </CardContent>
      <CardFooter className="py-2">
        <Button variant="link" className="px-0">
          See our guideline
          <IconPlaceholder
            lucide="ExternalLinkIcon"
            tabler="IconExternalLink"
            hugeicons="LinkSquare01Icon"
            phosphor="ArrowSquareOutIcon"
            remixicon="RiExternalLinkLine"
            aria-hidden="true"
          />
        </Button>
      </CardFooter>
    </Card>
  )
}
