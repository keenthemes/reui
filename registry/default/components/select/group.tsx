import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/select';

export default function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Choose a framework" />
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
