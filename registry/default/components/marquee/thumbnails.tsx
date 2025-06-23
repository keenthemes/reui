import { Avatar, AvatarFallback, AvatarImage } from '@/registry/default/ui/avatar';
import { Card, CardContent } from '@/registry/default/ui/card';
import { Marquee } from '@/registry/default/ui/marquee';

// Unique reviews data
const testimonials = [
  {
    name: 'Ava Green',
    username: '@ava',
    body: 'Cascade AI made my workflow 10x faster!',
    img: 'https://randomuser.me/api/portraits/women/32.jpg',
    country: '🇦🇺 Australia',
  },
];

function TestimonialCard({ img, name, username, body, country }: (typeof testimonials)[number]) {
  return (
    <Card className="w-64">
      <CardContent>
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarImage src={img} alt="@reui_io" />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium text-foreground flex items-center gap-1">
              {name} <span className="text-xs">{country}</span>
            </figcaption>
            <p className="text-xs font-medium text-muted-foreground">{username}</p>
          </div>
        </div>
        <blockquote className="mt-3 text-sm text-econdary-foreground">{body}</blockquote>
      </CardContent>
    </Card>
  );
}

export default function Component() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-1 overflow-hidden py-8">
      {/* Marquee moving left to right (default) */}
      <Marquee pauseOnHover repeat={3} className="[--duration:40s]">
        {testimonials.map((review) => (
          <TestimonialCard key={review.username} {...review} />
        ))}
      </Marquee>
      {/* Marquee moving right to left (reverse) */}
      <Marquee pauseOnHover reverse repeat={3} className="[--duration:40s]">
        {testimonials.map((review) => (
          <TestimonialCard key={review.username} {...review} />
        ))}
      </Marquee>
      {/* Stylish gradient overlays */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background/95 to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background/95 to-transparent"></div>
      <div className="pointer-events-none absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-background/90 to-transparent"></div>
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-background/90 to-transparent"></div>
    </div>
  );
}
