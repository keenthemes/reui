import { Card, CardContent } from "@/registry/default/ui/card";
import { User2, Mail, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    icon: User2,
    title: "Active Contacts",
    value: 202123,
    delta: 22325,
    deltaPercent: 12.2,
    positive: true,
    time: "last 12 months",
  },
  {
    icon: Mail,
    title: "Emails Opened",
    value: 78500,
    delta: 8500,
    deltaPercent: 12.1,
    positive: true,
    time: "last 12 months",
  },
  {
    icon: MousePointer2,
    title: "Avg Click Rate",
    value: 26.2,
    isPercent: true,
    delta: -2.3,
    deltaPercent: -8.1,
    positive: false,
    time: "last 12 months",
  },
];

export default function StatisticCard6() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-12">
      <div className="grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="space-y-5">
							{/* Header */}
							<div className="flex flex-col items-start justify-center gap-1.5">
								<stat.icon className="w-6 text-muted-foreground" />
								<h3 className="text-sm text-muted-foreground/90 font-medium">{stat.title}</h3>
							</div>

							{/* Content */}
							<div className="space-y-1.5">
								{/* Value */}
								<div className="text-2xl font-semibold text-foreground tracking-tight">
									{stat.isPercent ? `${stat.value}%` : stat.value.toLocaleString()}
								</div>

								{/* Delta */}
								<div className="flex items-center gap-1.5 text-xs">
									<span
										className={cn(
											"font-medium",
											stat.positive
												? "text-green-500"
												: "text-destructive"
										)}
									>
										{stat.positive ? "+" : ""}
										{stat.delta.toLocaleString()}
										{stat.deltaPercent !== undefined && (
											<> ({stat.deltaPercent > 0 ? "+" : ""}{stat.deltaPercent}%)</>
										)}
									</span>
									<span className="bg-muted-foreground/30 size-1 rounded-full"></span>
									<span className="text-muted-foreground">
										 {stat.time}
									</span>
								</div>
							</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}