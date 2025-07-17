import { Button } from '@/registry/default/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardToolbar } from '@/registry/default/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu';
import { MoreVertical, Pin, Settings, Share2, ShieldCheck, Trash, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StatisticCard13() {
  const total = 30;
  const passing = 20;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-8">
      <Card className="w-full max-w-sm">
        <CardHeader className="border-0 min-h-auto py-5">
          <CardTitle className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Compliance Checks</span>
          </CardTitle>
          <CardToolbar>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="dim" size="sm" mode="icon" className="-me-1.5">
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom">
                <DropdownMenuItem>
                  <Settings />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <TriangleAlert /> Export Report
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Pin /> Configure Alerts
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Share2 /> Run Manual Check
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ShieldCheck /> View History
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardToolbar>
        </CardHeader>

        <CardContent className="space-y-2.5">
          {/* Progress Bar */}
          <div className="flex grow gap-1">
            {[...Array(total)].map((_, i) => (
              <span
                key={i}
                className={cn(
                  `inline-block w-3 h-4 rounded-sm border transition-colors`,
                  i < passing ? 'bg-primary border-primary' : 'bg-muted border-muted',
                )}
              />
            ))}
          </div>

          {/* Passing Checks */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
            <span>{passing}/16 checks passing</span>
            <span className="font-semibold text-foreground">{Math.round((passing / total) * 100)}% assigned</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
