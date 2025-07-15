import { Card, CardContent } from "@/registry/default/ui/card";
import { Badge } from "@/registry/default/ui/badge";
import { LifeBuoy, CheckCircle2, Smile } from "lucide-react";

const cards = [
  {
    icon: LifeBuoy,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    value: 320,
    label: "Support Tickets",
    info: <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">12 Open, 308 Closed</span>,
  },
  {
    icon: CheckCircle2,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    value: "98%",
    label: "Resolved",
    info: <Badge className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">+2.1% this month</Badge>,
  },
  {
    icon: Smile,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
    value: "4.8",
    label: "Satisfaction Rate",
    info: <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">Avg. (out of 5)</span>,
  },
];

export default function StatisticCard12() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-8 bg-muted/40">
      <div className="grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl">
        {cards.map((card, i) => (
          <Card key={i} className="rounded-xl border bg-white/90 shadow-sm p-0">
            <CardContent className="flex flex-col items-start gap-4 p-6">
              <div className={`rounded-md ${card.iconBg} flex items-center justify-center w-8 h-8 mb-1`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <div className="text-2xl font-bold text-foreground leading-tight">{card.value}</div>
              <div className="text-sm text-muted-foreground mb-2">{card.label}</div>
              {card.info}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}