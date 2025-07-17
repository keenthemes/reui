import { Badge } from '@/registry/default/ui/badge';
import { Card, CardContent } from '@/registry/default/ui/card';
import { Briefcase, ShoppingCart, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const cards = [
  {
    icon: Briefcase,
    iconColor: 'text-green-600',
    title: 'Active Projects',
    badge: {
      color: 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400',
      icon: TrendingUp,
      iconColor: 'text-green-500',
      text: '+12.8%',
    },
    value: 17,
    dateRange: 'From Jan 01 - Jul 30, 2024',
  },
  {
    icon: ShoppingCart,
    iconColor: 'text-blue-600',
    title: 'Orders Processed',
    badge: {
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
      icon: TrendingUp,
      iconColor: 'text-blue-500',
      text: '+3.7%',
    },
    value: 3421,
    dateRange: 'From Jan 01 - Jul 30, 2024',
  },
  {
    icon: Users,
    iconColor: 'text-pink-600',
    title: 'Churned Users',
    badge: {
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400',
      icon: TrendingDown,
      iconColor: 'text-pink-500',
      text: '-2.1%',
    },
    value: 89,
    dateRange: 'From Jan 01 - Jul 30, 2024',
  },
];

export default function StatisticCard8() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-12">
      {/* Container */}
      <div className="@container grow w-full">
        {/* Grid */}
        <div className="grid grid-cols-1 @3xl:grid-cols-3 gap-6">
          {/* Cards */}
          {cards.map((card, i) => (
            <Card key={i}>
              <CardContent className="flex flex-col h-full">
                {/* Title & Badge */}
                <div className="flex items-center justify-between mb-8">
                  <card.icon className={cn('size-6', card.iconColor)} />

                  <Badge className={cn('px-2 py-1 rounded-full', card.badge.color)}>
                    <card.badge.icon className={`w-3 h-3 ${card.badge.iconColor}`} />
                    {card.badge.text}
                  </Badge>
                </div>

                {/* Value & Date Range */}
                <div className="flex-1 flex flex-col justify-between grow">
                  {/* Value */}
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
    </div>
  );
}
