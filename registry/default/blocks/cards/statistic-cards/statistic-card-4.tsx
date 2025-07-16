import { Badge } from '@/registry/default/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardToolbar } from '@/registry/default/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/default/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/registry/default/ui/tooltip';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const leadsData = {
  newLeads: 54,
  returningLeads: 198,
  newPercent: 21.43,
  returningPercent: 78.57,
  topSource: 'LinkedIn',
  conversionRate: 12.8,
};

export default function StatisticCard4() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-8">
      <Card className="w-full md:w-[450px]">
        <CardHeader className="border-0 pt-6 pb-5">
          <CardTitle>Leads Overview</CardTitle>
          <CardToolbar>
            <Select defaultValue="this-month">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </CardToolbar>
        </CardHeader>
        <CardContent>
          <div className="flex items-stretch gap-x-6 mb-4">
            {/* New Leads */}
            <div className="flex-1 flex flex-col items-start gap-1">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-2xl font-bold text-foreground">{leadsData.newLeads}</span>
                <Badge size="sm" variant="primary" appearance="light">
                  {leadsData.newPercent}%
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground font-medium">New leads</span>
              {/* Solid Progress Bar */}
              <div className="w-full mt-1">
                <div className="h-2.5 rounded-xs bg-muted overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-xs transition-all"
                    style={{ width: `${leadsData.newPercent}%` }}
                  />
                </div>
              </div>
            </div>
            {/* Returning Leads */}
            <div className="flex-1 flex flex-col items-start gap-1 border-s border-muted-foreground/10 ps-6">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-2xl font-bold text-foreground">{leadsData.returningLeads}</span>
              </div>
              <span className="text-sm text-muted-foreground font-medium">Returning leads</span>
              {/* Dotted Bar */}
              <div className="w-full mt-1 flex gap-0.5">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-2.5 w-0.5 rounded-full flex-1',
                      i < Math.round((leadsData.returningPercent / 100) * 30) ? 'bg-green-500' : 'bg-muted',
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Extra Details */}
          <div className="flex items-center gap-x-4 mb-1.5">
            <div className="flex flex-col flex-1 gap-0.5">
              <span className="text-xs text-muted-foreground">Top Source</span>
              <span className="text-sm font-medium text-foreground">{leadsData.topSource}</span>
            </div>
            <div className="flex flex-col flex-1 gap-0.5 ps-7.5">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                Conversion Rate
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="size-3.5 text-muted-foreground cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Percentage of leads converted to customers.</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
              <span className="text-sm font-medium text-foreground">{leadsData.conversionRate}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
