import { Card, CardHeader, CardTitle, CardToolbar, CardContent } from "@/registry/default/ui/card";
import { Badge } from "@/registry/default/ui/badge";
import { MoreHorizontal, BarChart2 } from "lucide-react";
import { Button } from "@/registry/default/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/registry/default/ui/dropdown-menu";

export default function StatisticCard10() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-8 bg-muted/40">
      <Card className="w-full max-w-md rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between gap-2 border-0 pb-2 pt-6 px-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-50 p-2.5 flex items-center justify-center">
              <BarChart2 className="w-6 h-6 text-emerald-500" />
            </span>
            <CardTitle className="text-lg font-semibold text-foreground">Total SaaS Revenue</CardTitle>
          </div>
          <CardToolbar>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="dim" size="sm" mode="icon" className="-me-1.5">
                  <MoreHorizontal />
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
        <CardContent className="px-6 pb-6 pt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl font-bold text-foreground tracking-tight">$ 1,120,500</span>
            <span className="text-lg text-muted-foreground font-medium">USD</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-none">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline-block"><path d="M3 5.5L7 9.5L11 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              -12.7%
            </Badge>
            <span className="text-sm text-muted-foreground">decreased from last quarter</span>
          </div>
          <div className="bg-muted/60 rounded-xl px-4 py-3 mt-2">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-muted-foreground">Avg. Subscription Value :</span>
              <span className="text-base font-semibold text-foreground">$ 320</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-muted-foreground">Enterprise Clients :</span>
              <span className="text-base font-semibold text-foreground">42</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}