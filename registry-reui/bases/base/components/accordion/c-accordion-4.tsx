// Description: Accordion embedded within a Card
// Order: 4

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/bases/base/ui/accordion"
import { Button } from "@/registry/bases/base/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const items = [
  {
    value: "plans",
    trigger: "What subscription plans do you offer?",
    content: (
      <>
        <p>
          <a href="#" className="text-primary hover:underline">
            Annual billing is available
          </a>{" "}
          with a 20% discount. All plans include a 14-day free trial with no
          credit card required.
        </p>
        <Button size="sm" className="mt-4">
          View plans
          <IconPlaceholder
            lucide="ArrowUpRightIcon"
            tabler="IconArrowUpRight"
            hugeicons="ArrowUpRight01Icon"
            phosphor="ArrowUpRightIcon"
            remixicon="RiArrowRightUpLine"
            className="size-4"
          />
        </Button>
      </>
    ),
  },
  {
    value: "billing",
    trigger: "How does billing work?",
    content: (
      <>
        <p>
          Billing occurs automatically at the start of each billing cycle. We
          accept all major credit cards, PayPal, and ACH transfers for
          enterprise customers.
        </p>
      </>
    ),
  },
  {
    value: "security",
    trigger: "Is my data secure?",
    content: (
      <>
        <p>
          We take security seriously. All data is encrypted at rest using
          AES-256 and in transit via TLS 1.3. We perform regular third-party
          security audits and maintain SOC 2 Type II compliance.
        </p>
        <p>
          You can also enable multi-factor authentication (MFA) and single
          sign-on (SSO) for additional security.
        </p>
      </>
    ),
  },
]

export default function Pattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Subscription & Billing</CardTitle>
          <CardDescription>
            Common questions about your account, plans, and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion multiple defaultValue={["plans"]}>
            {items.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>{item.trigger}</AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
