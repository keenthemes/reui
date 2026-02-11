// Description: Advanced accordion with custom icons and badges
// Order: 6

import { Badge } from "@/registry-reui/bases/base/reui/badge"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/bases/base/ui/accordion"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const items = [
  {
    value: "account",
    icon: (
      <IconPlaceholder
        lucide="SettingsIcon"
        tabler="IconSettings"
        hugeicons="SettingsIcon"
        phosphor="GearIcon"
        remixicon="RiSettings3Line"
        className="text-muted-foreground size-4"
      />
    ),
    trigger: "Account Settings",
    badge: "New",
    content:
      "Manage your account preferences, security settings, and personal information. You can also configure two-factor authentication here.",
  },
  {
    value: "privacy",
    icon: (
      <IconPlaceholder
        lucide="LockIcon"
        tabler="IconLock"
        hugeicons="SquareLock01Icon"
        phosphor="LockSimpleIcon"
        remixicon="RiLockLine"
        className="text-muted-foreground size-4"
      />
    ),
    trigger: "Privacy & Security",
    content:
      "Control who can see your profile and what data we collect. View our latest security audits and transparency reports.",
  },
  {
    value: "support",
    icon: (
      <IconPlaceholder
        lucide="HelpCircleIcon"
        tabler="IconHelpCircle"
        hugeicons="HelpCircleIcon"
        phosphor="QuestionIcon"
        remixicon="RiQuestionLine"
        className="text-muted-foreground size-4"
      />
    ),
    trigger: "Help & Support",
    content:
      "Access our help center, community forums, and contact support. We're here to help you 24/7.",
  },
]

export default function Pattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Accordion
        multiple={false}
        defaultValue={["account"]}
        className="space-y-3 border-0"
      >
        {items.map((item) => (
          <AccordionItem
            key={item.value}
            value={item.value}
            className="border-border bg-card style-vega:rounded-lg style-nova:rounded-lg style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md border px-2 **:data-[slot=accordion-content]:p-0!"
          >
            <AccordionTrigger className="items-center px-1 py-3 font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="bg-muted style-vega:rounded-lg style-nova:rounded-lg style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md flex size-8 items-center justify-center">
                  {item.icon}
                </div>
                <span>{item.trigger}</span>
                {item.badge && (
                  <Badge variant="success-light">{item.badge}</Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground px-2 pt-0 pb-4 leading-relaxed">
              <div className="pl-11">{item.content}</div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
