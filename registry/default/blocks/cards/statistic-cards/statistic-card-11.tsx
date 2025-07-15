import { Card, CardHeader, CardTitle, CardToolbar, CardContent } from "@/registry/default/ui/card";
import { Button } from "@/registry/default/ui/button";
import { Progress } from "@/registry/default/ui/progress";

export default function StatisticCard11() {
  const used = 1200;
  const total = 5000;
  const remaining = total - used;
  const percent = (used / total) * 100;
  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-8 bg-muted/40">
      <Card className="w-full max-w-lg rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-0 pb-2 pt-6 px-6">
          <CardTitle className="text-base font-semibold text-foreground">API Call Quota</CardTitle>
          <CardToolbar>
            <Button variant="outline" size="sm" className="font-medium">View API usage</Button>
          </CardToolbar>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-muted-foreground">Used calls: <span className="font-semibold text-foreground">{used}</span></span>
            <span className="text-base font-semibold text-foreground">${(used * 0.002).toFixed(2)}</span>
          </div>
          <Progress value={percent} className="h-1.5 bg-muted my-2" indicatorClassName="bg-[#7C5CFA]" />
          <div className="flex items-center justify-between mt-1 mb-2">
            <span className="text-sm font-semibold text-foreground">{remaining} free calls left</span>
            <span className="text-xs text-muted-foreground">of {total} monthly quota</span>
          </div>
          <div className="rounded-b-xl bg-muted/60 px-4 py-2.5 mt-4 text-xs text-muted-foreground flex items-center gap-2">
            <span>Quota renews on</span>
            <span className="font-medium text-foreground">September 1, 2024</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}