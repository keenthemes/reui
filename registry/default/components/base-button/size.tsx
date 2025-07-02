import { Button } from '@/registry/default/ui/base-button';
import { UserPen } from 'lucide-react';

export default function Component() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm">
          <UserPen />
          Small
        </Button>
        <Button variant="outline">
          <UserPen />
          Medium
        </Button>
        <Button variant="outline" size="lg">
          <UserPen />
          Xsmall
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" mode="icon">
          <UserPen />
        </Button>
        <Button variant="outline" mode="icon">
          <UserPen />
        </Button>
        <Button variant="outline" size="lg" mode="icon">
          <UserPen />
        </Button>
      </div>
    </div>
  );
}
