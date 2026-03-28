// Description: Button rendered as a Next.js Link
// Order: 27

import Link from "next/link"

import { Button } from "@/registry/bases/radix/ui/button"

export default function Pattern() {
  return (
    <Button asChild>
      <Link href="/">Back to Home</Link>
    </Button>
  )
}
