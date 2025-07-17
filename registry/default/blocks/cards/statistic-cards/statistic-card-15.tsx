import Link from 'next/link';
import { Card, CardContent } from '@/registry/default/ui/card';
import { ArrowRight, ChartNoAxesCombined, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const cards = [
  {
    color: 'bg-blue-600',
    icon: ChartNoAxesCombined,
    value: '27.3%',
    title: 'NPS Improvement',
    desc: 'Our new onboarding flow increased Net Promoter Score by 27.3% in Q2.',
    cta: 'Read full story',
  },
  {
    color: 'bg-emerald-600',
    icon: Users,
    value: '8,200',
    title: 'Active Users',
    desc: 'Highest monthly active users since launch. Engagement up 12% MoM.',
    cta: 'See user insights',
  },
  {
    color: 'bg-fuchsia-700',
    icon: TrendingUp,
    value: '$1.4M',
    title: 'ARR Growth',
    desc: 'Annual recurring revenue grew by $1.4M in the last quarter.',
    cta: 'View ARR breakdown',
  },
];

export default function StatisticCard15() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-8">
      <div className="@container grow w-full">
        <div className="grid grid-cols-1 @3xl:grid-cols-3 gap-8 w-full">
          {cards.map((card, i) => (
            <Card key={i} className={cn('rounded-2xl overflow-hidden shadow-lg p-0 border-0', card.color)}>
              <CardContent className="relative overflow-hidden flex flex-col justify-end py-6 px-0 pb-0">
                {/* Icon */}
                <div className="px-6 mb-3.5">
                  <card.icon className="size-8 text-white/60" />
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col justify-center items-start px-6">
                  <div className="text-white text-4xl font-bold mb-6">{card.value}</div>
                  <div className="text-white text-lg font-semibold mb-1">{card.title}</div>
                  <div className="text-white/80 text-sm mb-2">{card.desc}</div>
                </div>

                {/* Bottom bar */}
                <Link
                  href="#"
                  className="group/card w-full bg-black/90 dark:bg-zinc-800 px-6 py-4 flex items-center justify-between mt-6"
                >
                  <span className="text-white text-sm font-medium">{card.cta}</span>
                  <ArrowRight className="group-hover/card:translate-x-1 transition-transform duration-300 w-5 h-5 text-white" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
