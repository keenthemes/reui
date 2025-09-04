import { useState } from 'react';
import {
  Autocomplete,
  AutocompleteClear,
  AutocompleteControl,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompletePortal,
  AutocompletePositioner,
} from '@/registry/default/ui/base-autocomplete';
import { Badge } from '@/registry/default/ui/base-badge';
import { Label } from '@/registry/default/ui/base-label';

export default function AutocompleteDemo() {
  const [value, setValue] = useState<string>('');

  const filteredItems = techStacks.filter(
    (item) =>
      item.name.toLowerCase().includes(value.toLowerCase()) ||
      item.category.toLowerCase().includes(value.toLowerCase()) ||
      item.description.toLowerCase().includes(value.toLowerCase()),
  );

  return (
    <div className="w-full max-w-sm">
      <Autocomplete
        value={value}
        onValueChange={setValue}
        items={filteredItems}
        itemToStringValue={(item: unknown) => (item as TechStack).name}
      >
        <Label className="flex flex-col gap-2.5">
          Search Tech Stack
          <AutocompleteControl>
            <AutocompleteInput placeholder="Type to search frameworks, libraries..." />
            {value && <AutocompleteClear />}
          </AutocompleteControl>
        </Label>
        <AutocompletePortal>
          <AutocompletePositioner sideOffset={4}>
            <AutocompletePopup>
              <AutocompleteList>
                {filteredItems.map((item) => (
                  <AutocompleteItem key={item.id} value={item} className="group/autocomplete-item">
                    <div className="flex flex-col items-stretch grow">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        <Badge
                          variant="outline"
                          size="sm"
                          className="group-data-[highlighted]/autocomplete-item:bg-background group-data-[highlighted]/autocomplete-item:border-intput"
                        >
                          {item.category}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground roup-data-[highlighted]/autocomplete-item:text-secondary-foreground">
                        {item.description}
                      </span>
                    </div>
                  </AutocompleteItem>
                ))}
                {filteredItems.length === 0 && value && <AutocompleteEmpty>No tech stacks found.</AutocompleteEmpty>}
              </AutocompleteList>
            </AutocompletePopup>
          </AutocompletePositioner>
        </AutocompletePortal>
      </Autocomplete>
    </div>
  );
}

interface TechStack {
  id: string;
  name: string;
  category: string;
  description: string;
}

const techStacks: TechStack[] = [
  {
    id: 'react',
    name: 'React',
    category: 'Frontend',
    description: 'A JavaScript library for building user interfaces',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'Framework',
    description: 'The React framework for production with hybrid static & server rendering',
  },
  {
    id: 'vue',
    name: 'Vue.js',
    category: 'Frontend',
    description: 'Progressive JavaScript framework for building UIs',
  },
  {
    id: 'nuxt',
    name: 'Nuxt.js',
    category: 'Framework',
    description: 'The intuitive Vue framework for building modern web applications',
  },
  {
    id: 'angular',
    name: 'Angular',
    category: 'Frontend',
    description: 'Platform for building mobile and desktop web applications',
  },
  {
    id: 'svelte',
    name: 'Svelte',
    category: 'Frontend',
    description: 'Cybernetically enhanced web apps with compile-time optimizations',
  },
  {
    id: 'solid',
    name: 'Solid.js',
    category: 'Frontend',
    description: 'A reactive JavaScript library for building user interfaces',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Backend',
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine",
  },
  {
    id: 'express',
    name: 'Express.js',
    category: 'Backend',
    description: 'Fast, unopinionated, minimalist web framework for Node.js',
  },
  {
    id: 'fastify',
    name: 'Fastify',
    category: 'Backend',
    description: 'Fast and low overhead web framework for Node.js',
  },
  {
    id: 'nestjs',
    name: 'NestJS',
    category: 'Backend',
    description: 'A progressive Node.js framework for building efficient server-side applications',
  },
  {
    id: 'prisma',
    name: 'Prisma',
    category: 'Database',
    description: 'Next-generation ORM for Node.js and TypeScript',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'Database',
    description: 'Document-oriented NoSQL database program',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'Database',
    description: 'Open source object-relational database system',
  },
  {
    id: 'redis',
    name: 'Redis',
    category: 'Database',
    description: 'In-memory data structure store used as a database, cache, and message broker',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Styling',
    description: 'Utility-first CSS framework for rapidly building custom user interfaces',
  },
  {
    id: 'styled-components',
    name: 'Styled Components',
    category: 'Styling',
    description: 'Visual primitives for the component age with CSS-in-JS',
  },
  {
    id: 'emotion',
    name: 'Emotion',
    category: 'Styling',
    description: 'CSS-in-JS library designed for high performance style composition',
  },
  {
    id: 'framer-motion',
    name: 'Framer Motion',
    category: 'Animation',
    description: 'Production-ready motion library for React',
  },
  {
    id: 'gsap',
    name: 'GSAP',
    category: 'Animation',
    description: 'Professional-grade animation library for the modern web',
  },
  {
    id: 'three',
    name: 'Three.js',
    category: '3D',
    description: 'JavaScript 3D library for creating and displaying animated 3D computer graphics',
  },
  {
    id: 'react-three-fiber',
    name: 'React Three Fiber',
    category: '3D',
    description: 'React renderer for Three.js on the web and react-native',
  },
  {
    id: 'webpack',
    name: 'Webpack',
    category: 'Build Tool',
    description: 'Static module bundler for modern JavaScript applications',
  },
  {
    id: 'vite',
    name: 'Vite',
    category: 'Build Tool',
    description: 'Next generation frontend tooling with fast HMR and optimized builds',
  },
  {
    id: 'esbuild',
    name: 'esbuild',
    category: 'Build Tool',
    description: 'An extremely fast JavaScript bundler and minifier',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Language',
    description: 'Strongly typed programming language that builds on JavaScript',
  },
  {
    id: 'rust',
    name: 'Rust',
    category: 'Language',
    description: 'Systems programming language focused on safety, speed, and concurrency',
  },
  {
    id: 'go',
    name: 'Go',
    category: 'Language',
    description: 'Open source programming language that makes it easy to build simple, reliable software',
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Language',
    description: 'High-level programming language with dynamic semantics',
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'DevOps',
    description: 'Platform for developing, shipping, and running applications in containers',
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    category: 'DevOps',
    description: 'Container orchestration system for automating software deployment',
  },
];
