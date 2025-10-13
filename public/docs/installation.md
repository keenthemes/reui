---
title: Installation
description: This guide will help you get started with ReUI's copy-and-paste components in just a few minutes.
---

## Prerequisites

Before you can install and use ReUI, make sure your project meets the following requirements:

- **React**: Version 19 or higher.
- **TypeScript**: Version 5.7 or higher.
- **Tailwind CSS**: Version 4 or higher.
- **Radix UI**: Version 1 or higher.
- **Base UI**: Version 1 or higher.
- **Motion**: Version 12.19 or higher.

## Install Components

### 1. 

### 2. Initialize a React Project

ReUI is fully compatible with Shadcn and extends it with advanced component options.
To get started, set up your React project following the [Shadcn Installation Guide](https://ui.shadcn.com/docs/installation).

> ✅ If you already have a project compatible with Shadcn, you can skip this guide.

### 3. Install Radix UI

Follow [Radix UI Installation Guide](https://www.radix-ui.com/primitives/docs/overview/introduction#incremental-adoption) to install Radix UI package.

```bash
npm i radix-ui
```

### 4. Install Base UI

Follow [Base UI Installation Guide](https://base-ui.com/react/overview/quick-start) to install Base UI package.

```bash
npm i @base-ui-components/react
```

### 5. Install Motion

To use animated effects, follow [Motion Installation Guide](https://motion.dev/) to install Motion.

```bash
npm i motion
```

### 6. Integrate ReUI Styles

Add below code into your entry css file `globals.css`:

```css showLineNumbers
@import 'tailwindcss';

@import 'tw-animate-css';

/** Dark Mode Variant **/
@custom-variant dark (&:is(.dark *));

/** Colors **/
:root {
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --background: var(--color-white);
  --foreground: var(--color-zinc-950);
  --card: var(--color-white);
  --card-foreground: var(--color-zinc-950);
  --popover: var(--color-white);
  --popover-foreground: var(--color-zinc-950);
  --primary: var(--color-blue-500);
  --primary-foreground: var(--color-white);
  --secondary: var(--color-zinc-100);
  --secondary-foreground: var(--color-zinc-900);
  --muted: var(--color-zinc-100);
  --muted-foreground: var(--color-zinc-500);
  --accent: var(--color-zinc-100);
  --accent-foreground: var(--color-zinc-900);
  --destructive: var(--color-red-600);
  --destructive-foreground: var(--color-white);
  --chart-1: var(--color-blue-500);
  --chart-2: var(--color-green-500);
  --chart-3: var(--color-yellow-500);
  --chart-4: var(--color-red-500);
  --chart-5: var(--color-purple-500);
  --border: oklch(94% 0.004 286.32); /* between --color-zinc-100 and --color-zinc-200 */
  --input: var(--color-zinc-200);
  --ring: var(--color-zinc-400);
  --radius: 0.5rem;
}

.dark {
  --background: var(--color-zinc-950);
  --foreground: var(--color-zinc-50);
  --card: var(--color-zinc-950);
  --card-foreground: var(--color-zinc-50);
  --popover: var(--color-zinc-950);
  --popover-foreground: var(--color-zinc-50);
  --primary: var(--color-blue-600);
  --primary-foreground: var(--color-white);
  --secondary: var(--color-zinc-800);
  --secondary-foreground: var(--color-zinc-50);
  --muted: var(--color-zinc-900);
  --muted-foreground: var(--color-zinc-500);
  --accent: var(--color-zinc-900);
  --accent-foreground: var(--color-zinc-50);
  --destructive: var(--color-red-600);
  --destructive-foreground: var(--color-white);
  --chart-1: var(--color-blue-500);
  --chart-2: var(--color-green-500);
  --chart-3: var(--color-yellow-500);
  --chart-4: var(--color-red-500);
  --chart-5: var(--color-purple-500);
  --border: var(--color-zinc-800);
  --input: var(--color-zinc-800);
  --ring: var(--color-zinc-600);
}

/** Theme Setup **/
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);

  --animate-marquee: marquee var(--duration) infinite linear;
  --animate-marquee-vertical: marquee-vertical var(--duration) linear infinite;

  @keyframes marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(-100% - var(--gap)));
    }
  }

  @keyframes marquee-vertical {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(calc(-100% - var(--gap)));
    }
  }
}

/** Global Styles **/
@layer base {
  * {
    @apply border-border;
  }

  *:focus-visible {
    @apply outline-ring rounded-xs shadow-none outline-2 outline-offset-3 transition-none!;
  }
}

/** Custom Scrollbar **/
@layer base {
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: var(--input);
    border-radius: 5px;
  }
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--input) transparent;
  }
}

/** Custom Container **/
@utility container {
  margin-inline: auto;
  padding-inline: 1.5rem;
  @media (width >= --theme(--breakpoint-sm)) {
    max-width: none;
  }
  @media (width >= 1440px) {
    padding-inline: 2rem;
    max-width: 1440px;
  }
}

/** Smooth scroll **/
html {
  scroll-behavior: smooth;
}
```

### 7. Setup Inter Font(Next.js)

Add the following code to your root layout file (`app/layout.tsx` or `src/app/layout.tsx`):

```tsx
import { Inter } from 'next/font/google';
import { cn } from '@/utils/cn';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    
      {children}
    
  );
}
```

### 8. Setup System Fonts

Add the following code to your style entry file `globals.css`:

```css
@theme {
  --font-sans:
    'Geist', 'Geist Fallback', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol', 'Noto Color Emoji';
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}
```

> ✅ For a modern and visually appealing design, we recommend using [Inter](https://fonts.google.com/specimen/Inter) as
    the default font in your ReUI project.

### 9. Add Lucide Icon Library

```bash
npm i lucide
```

### 10. Add Remix Icon Library(optional)

```bash
npm i @remixicon/react
```

### 11. Setup Base UI Portals

Base UI uses portals for components that render popups, such as Dialog and Popover.
To make portalled components always appear on top of the entire page, add the `isolate` Tailwind class to your application layout root:

```tsx

```

### 12. Add Components

Explore the [ReUI Components](/docs/accordion) and add the ones you need into your project.