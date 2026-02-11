// Description: Secondary button with an icon on the left
// Order: 16

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Button variant="secondary">
      <IconPlaceholder
        lucide="GithubIcon"
        tabler="IconBrandGithub"
        hugeicons="GithubIcon"
        phosphor="GithubLogoIcon"
        remixicon="RiGithubLine"
        aria-hidden="true"
      />
      Github
    </Button>
  )
}
