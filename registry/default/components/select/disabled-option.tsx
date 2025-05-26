import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/select';

export default function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="developer">Developer</SelectItem>
        <SelectItem value="designer" disabled>
          Designer
        </SelectItem>
        <SelectItem value="manager">Manager</SelectItem>
        <SelectItem value="qa" disabled>
          QA Engineer
        </SelectItem>
        <SelectItem value="data-analyst">Data Analyst</SelectItem>
      </SelectContent>
    </Select>
  );
}
