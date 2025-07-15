import { Card, CardContent } from "@/registry/default/ui/card";
import { Badge } from "@/registry/default/ui/badge";
import { TrendingUp, TrendingDown, Briefcase, ShoppingCart, Users } from "lucide-react";

const cards = [
  {
    icon: Briefcase,
    iconColor: "text-green-600 bg-green-50",
    title: "Active Projects",
    badge: {
      color: "bg-green-100 text-green-600",
      icon: TrendingUp,
      iconColor: "text-green-500",
      text: "+12.8%",
    },
    value: 17,
    dateRange: "From Jan 01 - Jul 30, 2024",
  },
  {
    icon: ShoppingCart,
    iconColor: "text-blue-600 bg-blue-50",
    title: "Orders Processed",
    badge: {
      color: "bg-blue-100 text-blue-600",
      icon: TrendingUp,
      iconColor: "text-blue-500",
      text: "+3.7%",
    },
    value: 3421,
    dateRange: "From Jan 01 - Jul 30, 2024",
  },
  {
    icon: Users,
    iconColor: "text-red-600 bg-red-50",
    title: "Churned Users",
    badge: {
      color: "bg-red-100 text-red-600",
      icon: TrendingDown,
      iconColor: "text-red-500",
      text: "-2.1%",
    },
    value: 89,
    dateRange: "From Jan 01 - Jul 30, 2024",
  },
];

export default function StatisticCard8() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-12">
      <div className="grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
        {cards.map((card, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className={`rounded-md p-1.5 ${card.iconColor}`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <Badge className={`${card.badge.color} px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-none`}>
                  <card.badge.icon className={`w-3 h-3 ${card.badge.iconColor}`} />
                  {card.badge.text}
                </Badge>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-base font-medium text-muted-foreground mb-1">{card.title}</div>
                  <div className="text-3xl font-bold text-foreground mb-6">{card.value.toLocaleString()}</div>
                </div>
                <div className="pt-3 border-t border-muted text-xs text-muted-foreground font-medium">
                  {card.dateRange}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}