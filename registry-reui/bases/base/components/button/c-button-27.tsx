// Description: Button rendered as a Next.js Link
// Order: 27

import Link from "next/link"

import { Button } from "@/registry/bases/base/ui/button"

export default function Pattern() {
  return (
    <Button render={<Link href="/" />} nativeButton={false}>
      Back to Home
    </Button>
  )
}
