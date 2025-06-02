import fs from 'fs/promises';
import path from 'path';
import { codeToHtml } from 'shiki';

const sourcePath = path.resolve('./registry/default/components');
const cachePath = path.join(process.cwd(), 'registry', '.cache', 'default', 'components');

// Ensure the cache directory exists
async function ensureCacheDir() {
  await fs.mkdir(cachePath, { recursive: true });
}

// Function to process a component folder
async function processComponentDocs(componentFolder, componentName) {
  const componentCacheFile = path.join(cachePath, `${componentName}.json`);
  const entries = await fs.readdir(componentFolder);

  const cacheData = {};

  for (const entry of entries) {
    const entryPath = path.join(componentFolder, entry);
    const stat = await fs.stat(entryPath);

    if (stat.isFile()) {
      const fileExtension = path.extname(entry).slice(1);
      const rawCode = await fs.readFile(entryPath, 'utf-8');
      const code = rawCode
        .replaceAll('@/registry/default/ui/', '@/components/ui/')
        .replaceAll('@/registry/default/hooks/', '@/hooks/')
        .replaceAll('@/registry/default/lib/', '@/lib/');

      const highlightedCode = await codeToHtml(code, {
        lang: fileExtension,
        theme: 'github-dark-default',
        transformers: [
          {
            code(node) {
              node.properties['data-line-numbers'] = '';
            },
          },
        ],
      });

      const exampleName = path.basename(entry, `.${fileExtension}`); // File name without extension

      cacheData[`${componentName}/${exampleName}`] = {
        code,
        highlightedCode,
      };
    }
  }

  // Save component cache file
  await fs.writeFile(componentCacheFile, JSON.stringify(cacheData, null, 2), 'utf-8');
  console.log(`Cached: ${componentName}`);
}

// Main function to process all component examples
async function generateComponentCaches() {
  try {
    console.log('Ensuring cache directory exists...');
    await ensureCacheDir();

    console.log('Processing component docs...');
    const components = await fs.readdir(sourcePath);

    for (const component of components) {
      const componentFolder = path.join(sourcePath, component);
      const stat = await fs.stat(componentFolder);

      if (stat.isDirectory()) {
        await processComponentDocs(componentFolder, component);
      }
    }

    console.log('Component examples cached successfully.');
  } catch (error) {
    console.error('Error generating component caches:', error);
  }
}

// Execute the script
generateComponentCaches();
