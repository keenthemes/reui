import { ComponentCode, ComponentExamples } from '@/config/types';

export async function resolveComponent(name: string): Promise<ComponentExamples> {
  const result: ComponentExamples = {};

  try {
    const cacheData = await import(`@/registry/.cache/default/components/${name}.json`, {
      assert: { type: 'json' },
    });

    return cacheData as ComponentExamples;
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'MODULE_NOT_FOUND') {
      console.warn(`No examples found for component "${name}".`);
    } else {
      console.warn(`Error resolving examples for component "${name}":`, err);
    }
  }

  return result;
}

export async function resolveCode(name: string): Promise<ComponentCode> {
  // Mapping of components to their related components
  const relatedComponentsMap: Record<string, string[]> = {
    'data-grid': [
      'data-grid-column-filter',
      'data-grid-column-header',
      'data-grid-column-visibility',
      'data-grid-pagination',
      'data-grid-table-dnd-rows',
      'data-grid-table-dnd',
      'data-grid-table',
    ],
    slider: ['use-slider-input'],
  };

  const result: ComponentCode = {};

  try {
    // Load the main component code
    const cacheData = await import(`@/registry/.cache/default/ui/${name}.json`, {
      assert: { type: 'json' },
    });

    // Merge the main component data into the result
    // Use .default since dynamic import returns a module object
    Object.assign(result, cacheData as ComponentCode);

    // Check if the component has related components in the map
    const relatedComponents = relatedComponentsMap[name.toLowerCase()];
    if (relatedComponents) {
      for (const component of relatedComponents) {
        try {
          const relatedCacheData = await import(`@/registry/.cache/default/ui/${component}.json`, {
            assert: { type: 'json' },
          });
          // Merge related component data
          Object.assign(result, relatedCacheData as ComponentCode);
        } catch (error: unknown) {
          const err = error as NodeJS.ErrnoException;
          if (err.code === 'MODULE_NOT_FOUND') {
            console.warn(`No code found for related component "${component}".`);
          } else {
            console.warn(`Error resolving related component "${component}":`, err);
          }
        }
      }
    }

    return result;
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'MODULE_NOT_FOUND') {
      console.warn(`No code found for component "${name}".`);
    } else {
      console.warn(`Error resolving component "${name}":`, err);
    }
    return result; // Return empty result on failure
  }
}
