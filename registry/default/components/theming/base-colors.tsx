import { cn } from '@/registry/default/lib/utils';

export const colors = [
  {
    name: 'body',
    className: 'bg-background text-foreground',
  },
  {
    name: 'popover',
    className: 'bg-popover text-popover-foreground',
  },
  {
    name: 'card',
    className: 'bg-card text-card-foreground',
  },
  {
    name: 'muted',
    className: 'bg-muted text-muted-foreground',
  },
  {
    name: 'accent',
    className: 'bg-accent text-accent-foreground',
  },
  {
    name: 'secondary',
    className: 'bg-secondary text-secondary-foreground',
  },
  {
    name: 'primary',
    className: 'bg-primary text-primary-foreground',
  },
  {
    name: 'destructive',
    className: 'bg-destructive text-destructive-foreground',
  },
];

export default function ThemeDemo() {
  return (
    <div className="grid grid-cols-3 gap-x-8 gap-y-4 text-sm">
      {colors.map((color) => (
        <div key={color.name} className={cn('p-4 border border-border overflow-hidden rounded-xl', color.className)}>
          {color.name}
        </div>
      ))}
    </div>
  );
}
