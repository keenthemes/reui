import { Badge } from '@/registry/default/ui/badge';
import { Button } from '@/registry/default/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardToolbar } from '@/registry/default/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu';
import { BarChart2, MoreHorizontal } from 'lucide-react';

export default function StatisticCard10() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="border-0 py-6 min-h-auto">
          <CardTitle className="inline-flex items-center gap-2">
            <BarChart2 className="size-8 text-primary" />
            Total Revenue
          </CardTitle>
          <CardToolbar>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="dim" size="sm" mode="icon">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom">
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Export Data</DropdownMenuItem>
                <DropdownMenuItem>Pin to Dashboard</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Remove</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardToolbar>
        </CardHeader>
        <CardContent className="flex flex-col justify-between gap-3.5">
          <div className="space-y-3.5">
            {/* Revenue */}
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="text-3xl font-bold text-foreground tracking-tight">$ 1,120,500</span>
              <span className="text-xs text-muted-foreground font-medium leading-none">USD</span>
            </div>

            {/* Revenue trend */}
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="success" appearance="light">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline-block">
                  <path
                    d="M3 5.5L7 9.5L11 5.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                -12.7%
              </Badge>
              <span className="text-sm text-muted-foreground">decreased from last quarter</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="p-2.5 bg-muted/60 flex items-center justify-between rounded-lg">
              <span className="text-sm text-accent-foreground">Avg. Subscription Value:</span>
              <span className="text-base font-semibold text-foreground">$320</span>
            </div>
            <div className="p-2.5 bg-muted/60 flex items-center justify-between rounded-lg">
              <span className="text-sm text-accent-foreground">Enterprise Clients:</span>
              <span className="text-base font-semibold text-foreground">42</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
