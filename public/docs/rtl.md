---
title: RTL Support
description: This guide helps you to enable the RTL(Right-to-Left) localized support for your app.
component: true
links:
  - label: '@radix-ui/react-direction'
    url: https://www.radix-ui.com/primitives/docs/utilities/direction-provider
---

## Setup

### 1.

### 2. Install Radix Direction

Run the following command to add the Radix Direction provider to hande the direction support for your components:

```bash
npm install @radix-ui/react-direction
```

### 3. Add RTL Support

Wrap your application with the `DirectionProvider` component.
This ensures that all components adapt their behavior according to the `dir` prop.

```tsx
import { DirectionProvider } from '@radix-ui/react-direction';

export default () => ({
  /* Your app */
});
```
