import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/default/ui/base-select';

const items = [
  {
    label: 'Select a role',
    value: null,
  },
  {
    label: 'Developer',
    value: 'developer',
  },
  {
    label: 'Designer',
    value: 'designer',
  },
  {
    label: 'Manager',
    value: 'manager',
  },
  {
    label: 'QA Engineer',
    value: 'qa',
  },
  {
    label: 'Data Analyst',
    value: 'data-analyst',
  },
];

export default function BaseSelectDemo() {
  return (
    <Select items={items}>
      <SelectTrigger className="w-60">
        <SelectValue />
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
