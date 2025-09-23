import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/base-select';

const items = [
  {
    label: 'React',
    value: 'react',
  },
  {
    label: 'Next.js',
    value: 'nextjs',
  },
  {
    label: 'Angular',
    value: 'angular',
  },
  {
    label: 'Vue.js',
    value: 'vue',
  },
  {
    label: 'Svelte',
    value: 'svelte',
  },
  {
    label: 'Express',
    value: 'express',
  },
  {
    label: 'NestJS',
    value: 'nestjs',
  },
  {
    label: 'Django',
    value: 'django',
  },
  {
    label: 'Flask',
    value: 'flask',
  },
  {
    label: 'Laravel',
    value: 'laravel',
  },
];

export default function GroupDemo() {
  return (
    <Select items={items}>
      <SelectTrigger className="w-60 relative">
        <SelectValue>
          {(value) => {
            if (!value) return 'Select framework...';
            const item = items.find((item) => item.value === value);

            return item ? item.label : 'Select framework...';
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Frontend</SelectLabel>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="nextjs">Next.js</SelectItem>
          <SelectItem value="angular">Angular</SelectItem>
          <SelectItem value="vue">Vue.js</SelectItem>
          <SelectItem value="svelte">Svelte</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Backend</SelectLabel>
          <SelectItem value="express">Express</SelectItem>
          <SelectItem value="nestjs">NestJS</SelectItem>
          <SelectItem value="django">Django</SelectItem>
          <SelectItem value="flask">Flask</SelectItem>
          <SelectItem value="laravel">Laravel</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
