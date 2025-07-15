import { Card, CardContent, CardToolbar } from "@/registry/default/ui/card";
import { Badge } from "@/registry/default/ui/badge";
import { TrendingUp, TrendingDown, Banknote, Undo2, MoreHorizontal, Settings, Trash, Share2, Pin, TriangleAlert } from "lucide-react";
import { Button } from "@/registry/default/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/registry/default/ui/dropdown-menu";

const cards = [
  {
    icon: Banknote,
    iconBg: "bg-green-100",
    iconColor: "text-green-700",
    title: "Net Profit",
    value: "$87,450.00",
    badge: {
      color: "bg-green-100 text-green-700",
      icon: TrendingUp,
      iconColor: "text-green-600",
      text: "5.9%",
    },
    badgePositive: true,
    period: "last month",
  },
  {
    icon: Undo2,
    iconBg: "bg-red-100",
    iconColor: "text-red-700",
    title: "Refunds Issued",
    value: "$2,340.00",
    badge: {
      color: "bg-red-100 text-red-700",
      icon: TrendingDown,
      iconColor: "text-red-600",
      text: "-1.7%",
    },
    badgePositive: false,
    period: "last month",
  },
  {
    icon: Share2,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
    title: "Affiliate Revenue",
    value: "$12,800.00",
    badge: {
      color: "bg-blue-100 text-blue-700",
      icon: TrendingUp,
      iconColor: "text-blue-600",
      text: "+2.3%",
    },
    badgePositive: true,
    period: "last month",
  },
];

export default function StatisticCard9() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-12">
      <div className="grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
        {cards.map((card, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className={`rounded-full ${card.iconBg} flex items-center justify-center w-11 h-11`}>
                  <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <CardToolbar>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="dim" size="sm" mode="icon" className="-me-1.5">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="bottom">
                      <DropdownMenuItem>
                        <Settings />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <TriangleAlert /> Add Alert
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pin /> Pin to Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 /> Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        <Trash />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardToolbar>
              </div>
              <div className="text-base font-medium text-muted-foreground mb-1">{card.title}</div>
              <div className="text-3xl font-bold text-foreground mb-4">{card.value}</div>
              <div className="flex items-center gap-2">
                <Badge className={`${card.badge.color} px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-none`}>
                  <card.badge.icon className={`w-3 h-3 ${card.badge.iconColor}`} />
                  {card.badgePositive ? '+' : ''}{card.badge.text}
                </Badge>
                <span className="text-xs text-muted-foreground font-medium">{card.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}