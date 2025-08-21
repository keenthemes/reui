import { Rating } from '@/registry/default/ui/rating';

export default function RatingSizeDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Rating rating={4} size="sm" />
      <Rating rating={4} />
      <Rating rating={4} size="lg" />
    </div>
  );
}

