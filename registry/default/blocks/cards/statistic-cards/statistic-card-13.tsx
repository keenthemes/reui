import { Button } from '@/registry/default/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardToolbar } from '@/registry/default/ui/card';
import { MoreHorizontal, ShieldCheck } from 'lucide-react';

export default function StatisticCard13() {
  const total = 16;
  const passing = 6;
  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-8 bg-muted/40">
      <Card className="w-full max-w-xs rounded-xl border bg-white/90 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-0 pb-2 pt-5 px-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-sm font-semibold text-foreground">Compliance Checks</CardTitle>
          </div>
          <CardToolbar>
            <Button variant="ghost" size="icon" className="text-muted-foreground/70">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </CardToolbar>
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-1">
          <div className="flex gap-1 mb-2">
            {[...Array(total)].map((_, i) => (
              <span
                key={i}
                className={`inline-block w-3 h-3 rounded-sm border ${i < passing ? 'bg-blue-500 border-blue-500' : 'bg-muted border-muted'} transition-colors`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
            <span>{passing}/16 checks passing</span>
            <span className="font-semibold text-foreground">{Math.round((passing / total) * 100)}% assigned</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
