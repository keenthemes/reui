import { Card, CardContent } from "@/registry/default/ui/card";
import { Badge } from "@/registry/default/ui/badge";
import { ArrowUpRight, UserPlus, TrendingDown } from "lucide-react";

const cards = [
  {
    title: "Total Sales & Cost",
    subtitle: "Last 60 days",
    value: "$956.82k",
    valueColor: "text-[#7C5CFA]",
    badge: {
      color: "bg-green-100 text-green-600",
      icon: ArrowUpRight,
      iconColor: "text-green-500",
      text: "+5.4%",
    },
    subtext: (
      <span className="text-green-600 font-medium">
        +8.20k <span className="text-muted-foreground font-normal">vs prev. 60 days</span>
      </span>
    ),
  },
  {
    title: "New Customers",
    subtitle: "This quarter",
    value: "1,245",
    valueColor: "text-blue-600",
    badge: {
      color: "bg-blue-100 text-blue-600",
      icon: UserPlus,
      iconColor: "text-blue-500",
      text: "+3.2%",
    },
    subtext: (
      <span className="text-blue-600 font-medium">
        +39 <span className="text-muted-foreground font-normal">vs last quarter</span>
      </span>
    ),
  },
  {
    title: "Churn Rate",
    subtitle: "Last 30 days",
    value: "2.8%",
    valueColor: "text-red-500",
    badge: {
      color: "bg-red-100 text-red-600",
      icon: TrendingDown,
      iconColor: "text-red-500",
      text: "-1.1%",
    },
    subtext: (
      <span className="text-red-500 font-medium">
        -0.3% <span className="text-muted-foreground font-normal">vs prev. 30 days</span>
      </span>
    ),
  },
];

export default function StatisticCard7() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-12">
      <div className="grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
        {cards.map((card, i) => (
          <Card key={i}>
            <CardContent className="py-8 px-7 space-y-6">
              {/* Title & Subtitle */}
              <div className="space-y-1">
                <div className="text-lg font-semibold text-foreground">{card.title}</div>
                <div className="text-sm text-muted-foreground">{card.subtitle}</div>
              </div>
              {/* Value & Delta */}
              <div className="flex items-center gap-3">
                <span className={`text-4xl font-bold tracking-tight ${card.valueColor}`}>{card.value}</span>
                <Badge className={`${card.badge.color} px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-none`}>
                  <card.badge.icon className={`w-3 h-3 ${card.badge.iconColor}`} />
                  {card.badge.text}
                </Badge>
              </div>
              {/* Subtext */}
              <div className="text-sm">
                {card.subtext}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}