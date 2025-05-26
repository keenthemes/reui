import { cn } from '@/registry/default/lib/utils';

export const borderStyles = [
  {
    name: 'base border',
    className: 'border border-border',
  },
  {
    name: 'input border',
    className: 'border border-input',
  },
  {
    name: 'ring color',
    className: 'ring-2 ring-ring',
  },
];

export const radiusStyles = [
  {
    name: 'rounded-xl',
    className: 'bg-muted rounded-xl',
  },
  {
    name: 'rounded-lg',
    className: 'bg-muted rounded-lg',
  },
  {
    name: 'rounded-md',
    className: 'bg-muted rounded-md',
  },
  {
    name: 'rounded-sm',
    className: 'bg-muted rounded-sm',
  },
];

export default function ThemeDemo() {
  return (
    <div className="space-y-8 text-foreground">
      <div className="grid grid-cols-3 gap-6 text-sm">
        {borderStyles.map((style) => (
          <div
            key={style.name}
            className={cn('p-4 overflow-hidden rounded-xl', style.className)}
          >
            {style.name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-x-8 gap-y-4 text-sm">
        {radiusStyles.map((style) => (
          <div
            key={style.name}
            className={cn('p-4 overflow-hidden', style.className)}
          >
            {style.name}
          </div>
        ))}
      </div>
    </div>
  );
}
