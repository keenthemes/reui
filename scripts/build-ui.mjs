import fs from 'fs/promises';
import path from 'path';
import { codeToHtml } from 'shiki';

// Paths configuration
const sourcePath = path.resolve('./registry/default/ui');
const cachePath = path.join(process.cwd(), 'registry', '.cache', 'default', 'ui');

// Ensure the cache directory exists
async function ensureCacheDir() {
  try {
    await fs.mkdir(cachePath, { recursive: true });
    console.log('Cache directory ensured at:', cachePath);
  } catch (error) {
    console.error('Failed to create cache directory:', error);
    throw error;
  }
}

// Process a single component file and cache its content
async function processComponent(filePath, componentName, sourcePath) {
  const componentCacheFile = path.join(cachePath, `${componentName}.json`);
  let cacheData = { [componentName]: [] };

  try {
    const fileExtension = path.extname(filePath).slice(1);
    if (!fileExtension) {
      console.warn(`Skipping file with no extension: ${filePath}`);
      return;
    }

    const rawCode = await fs.readFile(filePath, 'utf-8');
    const code = rawCode
      .replaceAll('@/registry/default/ui/', '@/components/ui/')
      .replaceAll('@/registry/default/hooks/', '@/hooks/')
      .replaceAll('@/registry/default/lib/', '@/lib/');

    console.log(`Processing file: ${filePath} (${fileExtension})`);

    let highlightedCode;
    try {
      highlightedCode = await codeToHtml(code, {
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
    } catch (error) {
      console.error(`Failed to highlight ${filePath}:`, error);
      return;
    }

    // Attempt to read existing cache file, but don’t fail if it doesn’t exist
    let existingData = {};
    try {
      const existingContent = await fs.readFile(componentCacheFile, 'utf-8');
      existingData = JSON.parse(existingContent);
      if (!Array.isArray(existingData[componentName])) {
        existingData[componentName] = [existingData[componentName]];
      }
      cacheData = existingData;
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(`Error reading cache file ${componentCacheFile}:`, error);
      }
      // If ENOENT, proceed with new data; otherwise, log unexpected errors
    }

    const componentData = {
      code,
      highlightedCode,
      sourcePath: path.relative(process.cwd(), sourcePath),
      filePath: path.relative(process.cwd(), filePath),
      timestamp: new Date().toISOString(),
    };

    cacheData[componentName] = componentData;

    // Write the cache file (this is where we want to fail if it errors)
    try {
      await fs.writeFile(componentCacheFile, JSON.stringify(cacheData, null, 2), 'utf-8');
      console.log(`Cached: ${componentName} -> ${componentCacheFile}`);
    } catch (error) {
      console.error(`Failed to write cache file ${componentCacheFile}:`, error);
      throw error; // Critical error: stop processing this component
    }
  } catch (error) {
    console.error(`Error processing ${componentName} from ${filePath}:`, error);
    return; // Don’t throw here—let other components continue
  }
}

// Main function to generate caches for all component files from a single sourcePath
async function generateComponentCaches() {
  try {
    console.log('Starting component cache generation...');
    await ensureCacheDir();

    const entries = await fs.readdir(sourcePath, { withFileTypes: true });
    console.log(`Processing source path: ${sourcePath}`);
    console.log(`Found ${entries.length} entries in ${sourcePath}`);

    if (entries.length === 0) {
      console.warn('No files found in source directory:', sourcePath);
      return;
    }

    let fileCount = 0;
    for (const entry of entries) {
      if (!entry.isFile()) {
        console.log(`Skipping non-file: ${entry.name}`);
        continue;
      }
      fileCount++;
      const filePath = path.join(sourcePath, entry.name);
      const componentName = path.basename(entry.name, path.extname(entry.name));
      await processComponent(filePath, componentName, sourcePath);
    }

    if (fileCount === 0) {
      console.warn('No valid component files found in source path.');
      return;
    }

    console.log(`\nAll ${fileCount} component files cached successfully from ${sourcePath} into ${cachePath}.`);
  } catch (error) {
    console.error('Failed to generate component caches:', error);
    process.exit(1);
  }
}

// Run the script
generateComponentCaches();
