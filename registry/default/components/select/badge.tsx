import { Badge } from '@/registry/default/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/select';

export default function SelectDemo() {
  return (
    <Select defaultValue="3" indicatorPosition="right">
      <SelectTrigger className="w-[200px]">
        <span className="inline-flex items-center space-x-2">
          Status: <SelectValue placeholder="Select framework" />
        </span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">
          <Badge variant="primary" size="sm" appearance="outline">
            In Progress
          </Badge>
        </SelectItem>
        <SelectItem value="2">
          <Badge variant="primary" size="sm" appearance="outline">
            Completed
          </Badge>
        </SelectItem>
        <SelectItem value="3">
          <Badge variant="primary" size="sm" appearance="outline">
            Pending
          </Badge>
        </SelectItem>
        <SelectItem value="4">
          <Badge variant="destructive" size="sm" appearance="outline">
            Cancelled
          </Badge>
        </SelectItem>
        <SelectItem value="5">
          <Badge variant="destructive" size="sm" appearance="outline">
            Rejected
          </Badge>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
