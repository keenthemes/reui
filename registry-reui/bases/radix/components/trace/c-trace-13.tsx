import { Card, CardContent } from "@/registry/bases/radix/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/bases/radix/ui/table"
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

const MODELS = [
  { name: "stg_orders", rows: "1.2M rows" },
  { name: "stg_customers", rows: "84K rows" },
  { name: "int_order_items", rows: "3.4M rows" },
  { name: "fct_revenue", rows: "1.1M rows" },
]

const DUPLICATES = [
  { orderId: "ord_8821340", copies: 2 },
  { orderId: "ord_8823004", copies: 3 },
]

// The skipped model stays listed as pending, so the run shows which report is
// stale.
export default function Pattern() {
  return (
    <div className="w-full max-w-md text-sm">
      <Trace>
        <TraceCollapsible>
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
              <TraceTitle>Built {MODELS.length} models</TraceTitle>
              <TraceDescription>1m 24s</TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {MODELS.map((model) => (
                <TraceLine key={model.name}>
                  <TraceTitle>{model.name}</TraceTitle>
                  <TraceDescription>{model.rows}</TraceDescription>
                </TraceLine>
              ))}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine status="error">
              <TraceIcon>
                <IconPlaceholder
                  lucide="FlaskConicalIcon"
                  tabler="IconFlask"
                  hugeicons="TestTube01Icon"
                  phosphor="FlaskIcon"
                  remixicon="RiFlaskLine"
                />
              </TraceIcon>
              <TraceTitle>Unique test failed on fct_revenue</TraceTitle>
              <TraceDescription>
                {DUPLICATES.length} duplicates
              </TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            {/* A borderless Card is the outer frame; the table sits flush in it. */}
            <Card className="p-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="h-8">order_id</TableHead>
                      <TableHead className="h-8 text-right">Copies</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {DUPLICATES.map((row) => (
                      <TableRow key={row.orderId}>
                        <TableCell className="py-1.5">
                          <code className="text-xs">{row.orderId}</code>
                        </TableCell>
                        <TableCell className="py-1.5 text-right">
                          {row.copies}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceLine status="pending">
          <TraceIcon>
            <IconPlaceholder
              lucide="CircleDashedIcon"
              tabler="IconCircleDashed"
              hugeicons="CircleDashedIcon"
              phosphor="CircleDashedIcon"
              remixicon="RiCheckboxBlankCircleLine"
            />
          </TraceIcon>
          <TraceTitle>Skipped dim_customer_ltv</TraceTitle>
          <TraceDescription>upstream failed</TraceDescription>
        </TraceLine>
      </Trace>
    </div>
  )
}
