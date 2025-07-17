import { Button } from '@/registry/default/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardToolbar } from '@/registry/default/ui/card';
import { Progress } from '@/registry/default/ui/progress';

export default function StatisticCard11() {
  const used = 2000;
  const total = 5000;
  const remaining = total - used;
  const percent = (used / total) * 100;
  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="border-0 min-h-auto pt-6 pb-4">
          <CardTitle>API Call Quota</CardTitle>
          <CardToolbar>
            <Button variant="outline" size="sm" className="font-medium">
              View API usage
            </Button>
          </CardToolbar>
        </CardHeader>
        <CardContent className="flex flex-col space-y-6">
          <div className="grow space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Used calls: <span className="font-semibold text-foreground">{used}</span>
              </span>
              <span className="text-base font-semibold text-foreground">${(used * 0.002).toFixed(2)}</span>
            </div>

            <div>
              <Progress value={percent} className="bg-muted" indicatorClassName="bg-indigo-500" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">{remaining} free calls left</span>
              <span className="text-xs text-muted-foreground">of {total} monthly quota</span>
            </div>
          </div>

          <div className="rounded-xl bg-muted/60 px-4 py-2.5 text-xs text-muted-foreground flex items-center justify-between gap-2">
            <span>Quota renews on</span>
            <span className="font-medium text-foreground">September 1, 2025</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
