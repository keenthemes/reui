import { CodeBlock } from "@/registry-reui/bases/radix/reui/code-block/code-block"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/radix/ui/dialog"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/registry/bases/radix/ui/trace"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const RESPONSE = `{
  "interval": "year",
  "plans": [
    {
      "id": "pro",
      "prices": {
        "month": { "priceId": "price_1Q8sZ7" },
        "year": { "priceId": "price_1Q8sZ9" }
      }
    },
    {
      "id": "team",
      "prices": {
        "month": { "priceId": "price_1Q8t02" }
      }
    }
  ]
}`

const FRAME = `export function CheckoutButton({ plan }: Props) {
  const { interval } = useBilling()
  const price = plan.prices[interval]
  const priceId = price.priceId
  return <Button onClick={() => checkout(priceId)}>Upgrade</Button>
}`

const FRAMEWORK_FRAMES = [
  "renderWithHooks",
  "updateFunctionComponent",
  "beginWork",
  "performUnitOfWork",
  "workLoopSync",
]

// The failing request opens in a dialog: its JSON body is too long to expand
// between one-line events.
export default function Pattern() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceTitle>Breadcrumbs</TraceTitle>
              <TraceDescription>4 events</TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              <TraceLine>
                <TraceIcon>
                  <IconPlaceholder
                    lucide="NavigationIcon"
                    tabler="IconNavigation"
                    hugeicons="Navigation03Icon"
                    phosphor="NavigationArrowIcon"
                    remixicon="RiNavigationLine"
                  />
                </TraceIcon>
                <TraceTitle>Navigated from / to /pricing</TraceTitle>
                <TraceDescription>14:31:02.118</TraceDescription>
              </TraceLine>
              <Dialog>
                <DialogTrigger>
                  <TraceLine>
                    <TraceIcon>
                      <IconPlaceholder
                        lucide="GlobeIcon"
                        tabler="IconWorld"
                        hugeicons="Globe02Icon"
                        phosphor="GlobeIcon"
                        remixicon="RiGlobalLine"
                      />
                    </TraceIcon>
                    <TraceTitle>GET /api/plans?interval=year, 200</TraceTitle>
                    <TraceDescription>14:31:05.611</TraceDescription>
                    <TraceIcon>
                      <IconPlaceholder
                        lucide="ChevronRightIcon"
                        tabler="IconChevronRight"
                        hugeicons="ArrowRight01Icon"
                        phosphor="CaretRightIcon"
                        remixicon="RiArrowRightSLine"
                      />
                    </TraceIcon>
                  </TraceLine>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>GET /api/plans?interval=year</DialogTitle>
                    <DialogDescription>
                      200 in 209 ms. The team plan has no yearly price.
                    </DialogDescription>
                  </DialogHeader>
                  <CodeBlock
                    code={RESPONSE}
                    language="json"
                    highlightedLines={[13, 14, 15]}
                    label="Response body"
                  />
                </DialogContent>
              </Dialog>
              <TraceLine>
                <TraceIcon>
                  <IconPlaceholder
                    lucide="MousePointer2Icon"
                    tabler="IconPointer"
                    hugeicons="Cursor01Icon"
                    phosphor="CursorIcon"
                    remixicon="RiCursorLine"
                  />
                </TraceIcon>
                <TraceTitle>Clicked Upgrade on Team</TraceTitle>
                <TraceDescription>14:31:09.023</TraceDescription>
              </TraceLine>
              <TraceLine status="error">
                <TraceIcon>
                  <IconPlaceholder
                    lucide="BugIcon"
                    tabler="IconBug"
                    hugeicons="Bug01Icon"
                    phosphor="BugIcon"
                    remixicon="RiBugLine"
                  />
                </TraceIcon>
                <TraceTitle>Threw TypeError in CheckoutButton</TraceTitle>
                <TraceDescription>14:31:09.024</TraceDescription>
              </TraceLine>
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceTitle>Stack trace</TraceTitle>
              <TraceDescription>1 in app, 5 framework</TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              <TraceCollapsible defaultOpen>
                <TraceCollapsibleTrigger>
                  <TraceLine status="error">
                    <TraceTitle>
                      <code className="text-xs">CheckoutButton</code>
                    </TraceTitle>
                    <TraceDescription>
                      <code className="text-xs">checkout-button.tsx:14:25</code>
                    </TraceDescription>
                  </TraceLine>
                </TraceCollapsibleTrigger>
                <TraceCollapsibleContent>
                  <CodeBlock
                    code={FRAME}
                    language="tsx"
                    showLineNumbers
                    startLine={11}
                    lineLevels={{ error: [4] }}
                    label="checkout-button.tsx around line 14"
                  />
                </TraceCollapsibleContent>
              </TraceCollapsible>
              {/* Framework frames fold into one row: they are real, but
                    rarely where the fix is. */}
              <TraceCollapsible>
                <TraceCollapsibleTrigger>
                  <TraceLine>
                    <TraceTitle>
                      {FRAMEWORK_FRAMES.length} frames in react-dom
                    </TraceTitle>
                  </TraceLine>
                </TraceCollapsibleTrigger>
                <TraceCollapsibleContent>
                  <Trace>
                    {FRAMEWORK_FRAMES.map((frame) => (
                      <TraceLine key={frame}>
                        <TraceTitle>
                          <code className="text-xs">{frame}</code>
                        </TraceTitle>
                      </TraceLine>
                    ))}
                  </Trace>
                </TraceCollapsibleContent>
              </TraceCollapsible>
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    </div>
  )
}
