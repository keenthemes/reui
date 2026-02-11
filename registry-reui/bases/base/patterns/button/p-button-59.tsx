// Description: Social login buttons with Remix icons
// Order: 59

import {
  RiFacebookFill,
  RiGithubFill,
  RiGoogleFill,
  RiTwitterXFill,
} from "@remixicon/react"

import { Button } from "@/registry/bases/base/ui/button"

export default function Pattern() {
  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline">
        <RiGoogleFill
          data-icon="inline-start"
          aria-hidden="true"
          className="text-[#DB4437] dark:text-white/60"
          size={16}
        />
        <span className="text-muted-foreground">Login with</span> Google
      </Button>
      <Button variant="outline">
        <RiTwitterXFill
          data-icon="inline-start"
          aria-hidden="true"
          className="text-[#14171a] dark:text-white/60"
          size={16}
        />
        <span className="text-muted-foreground">Login with</span> X
      </Button>
      <Button variant="outline">
        <RiFacebookFill
          data-icon="inline-start"
          aria-hidden="true"
          className="text-[#1877f2] dark:text-white/60"
          size={16}
        />
        <span className="text-muted-foreground">Login with</span> Facebook
      </Button>
      <Button variant="outline">
        <RiGithubFill
          data-icon="inline-start"
          aria-hidden="true"
          className="text-[#333333] dark:text-white/60"
          size={16}
        />
        <span className="text-muted-foreground">Login with</span> GitHub
      </Button>
    </div>
  )
}
