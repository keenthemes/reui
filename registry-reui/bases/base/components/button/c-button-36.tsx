// Description: Social login buttons with Remix Icons
// Order: 36

import {
  RiFacebookFill,
  RiGithubFill,
  RiGoogleFill,
  RiInstagramFill,
  RiLinkedinFill,
  RiTwitterXFill,
} from "@remixicon/react"

import { Button } from "@/registry/bases/base/ui/button"

export default function Pattern() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="icon">
        <RiGoogleFill aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon">
        <RiFacebookFill aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon">
        <RiTwitterXFill aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon">
        <RiGithubFill aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon">
        <RiLinkedinFill aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon">
        <RiInstagramFill aria-hidden="true" />
      </Button>
    </div>
  )
}
