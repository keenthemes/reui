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
