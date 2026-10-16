import { CodeBlock } from "@/registry-reui/bases/base/reui/code-block/code-block"

import { Bubble, BubbleContent } from "@/registry/bases/base/ui/bubble"
import { Message, MessageContent } from "@/registry/bases/base/ui/message"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/registry/bases/base/ui/trace"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const QUERIES = [
  {
    id: "by-day",
    title: "Queried trial signups by day",
    description: "28 rows",
    sql: `select date_trunc('day', created_at) as day, count(*)
from trials
where created_at >= current_date - 27
group by 1 order by 1`,
  },
  {
    id: "by-domain",
    title: "Queried bounces by email domain",
    description: "12 rows",
    sql: `select split_part(email, '@', 2) as domain, count(*)
from verification_attempts
where status = 'bounced' and created_at::date = '2026-10-06'
group by 1 order by 2 desc limit 12`,
  },
]

const DASHBOARDS = [
  { title: "Activation funnel, weekly", href: "#" },
  { title: "Email delivery health", href: "#" },
]

// The work folds into one row above the answer and the sources sit below it.
// keepMounted keeps an opened query open when the summary folds.
export default function Pattern() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>
              Why did trial signups drop last Tuesday?
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent>
          <div className="flex flex-col gap-4">
            <Trace>
              <TraceCollapsible defaultOpen>
                <TraceCollapsibleTrigger>
                  <TraceLine>
                    <TraceTitle>Worked for 38s</TraceTitle>
                    <TraceDescription>
                      {QUERIES.length} queries
                    </TraceDescription>
                  </TraceLine>
                </TraceCollapsibleTrigger>
                <TraceCollapsibleContent keepMounted>
                  <Trace>
                    {QUERIES.map((query) => (
                      <TraceCollapsible key={query.id}>
                        <TraceCollapsibleTrigger>
                          <TraceLine>
                            <TraceIcon>
                              <IconPlaceholder
                                lucide="DatabaseIcon"
                                tabler="IconDatabase"
                                hugeicons="Database02Icon"
                                phosphor="DatabaseIcon"
                                remixicon="RiDatabase2Line"
                              />
                            </TraceIcon>
                            <TraceTitle>{query.title}</TraceTitle>
                            <TraceDescription>
                              {query.description}
                            </TraceDescription>
                          </TraceLine>
                        </TraceCollapsibleTrigger>
                        <TraceCollapsibleContent>
                          <CodeBlock
                            code={query.sql}
                            language="sql"
                            label={query.title}
                            wrap
                          />
                        </TraceCollapsibleContent>
                      </TraceCollapsible>
                    ))}
                  </Trace>
                </TraceCollapsibleContent>
              </TraceCollapsible>
            </Trace>
            <p className="leading-relaxed text-pretty">
              Signups fell 41% because verification emails to Gmail bounced for
              4 hours after the DKIM record broke.
            </p>
            <Trace>
              <TraceCollapsible>
                <TraceCollapsibleTrigger>
                  <TraceLine>
                    <TraceIcon>
                      <IconPlaceholder
                        lucide="ChartLineIcon"
                        tabler="IconChartLine"
                        hugeicons="ChartLineData01Icon"
                        phosphor="ChartLineIcon"
                        remixicon="RiLineChartLine"
                      />
                    </TraceIcon>
                    <TraceTitle>Used {DASHBOARDS.length} dashboards</TraceTitle>
                  </TraceLine>
                </TraceCollapsibleTrigger>
                <TraceCollapsibleContent>
                  <Trace>
                    {DASHBOARDS.map((dashboard) => (
                      <a key={dashboard.title} href={dashboard.href}>
                        <TraceLine>
                          <TraceTitle>{dashboard.title}</TraceTitle>
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
                      </a>
                    ))}
                  </Trace>
                </TraceCollapsibleContent>
              </TraceCollapsible>
            </Trace>
          </div>
        </MessageContent>
      </Message>
    </div>
  )
}
