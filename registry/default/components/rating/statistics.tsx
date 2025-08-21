import { Rating } from '@/registry/default/ui/rating';
import { Card, CardTitle, CardHeading, CardDescription, CardContent, CardFooter, CardHeader } from '@/registry/default/ui/card';

export default function RatingStatisticsDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="min-h-auto border-b-0 pt-6">
        <CardHeading>
          <CardTitle>Customer Reviews Summary</CardTitle>
          <CardDescription>Based on 1,247 reviews</CardDescription>
        </CardHeading>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {[
          { stars: 5, count: 745, percentage: 59.7 },
          { stars: 4, count: 312, percentage: 25.0 },
          { stars: 3, count: 124, percentage: 9.9 },
          { stars: 2, count: 41, percentage: 3.3 },
          { stars: 1, count: 25, percentage: 2.0 },
        ].map((item) => (
          <div key={item.stars} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-medium w-2">{item.stars}</span>
              <Rating rating={item.stars} />
            </div>
            <div className="flex items-center gap-0.5 text-sm text-muted-foreground">
              <span>{item.count}</span>
              <span>({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
