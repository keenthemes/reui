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
        <SelectValue placeholder="Select framework" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-violet-500"></span>
            <span>In Progress</span>
          </span>
        </SelectItem>
        <SelectItem value="2">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-green-500"></span>
            <span>Completed</span>
          </span>
        </SelectItem>
        <SelectItem value="3">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary"></span>
            <span>Pending</span>
          </span>
        </SelectItem>
        <SelectItem value="4">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-yellow-500"></span>
            <span>Cancelled</span>
          </span>
        </SelectItem>
        <SelectItem value="5">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-destructive"></span>
            <span>Rejected</span>
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
