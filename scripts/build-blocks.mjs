import fs from 'fs/promises';
import path from 'path';
import { codeToHtml } from 'shiki';

const sourcePath = path.resolve('./registry/default/blocks');
const cacheBasePath = path.join(
  process.cwd(),
  'registry',
  '.cache',
  'default',
  'blocks',
);

async function ensureCacheDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function processSubCategoryBlocks(categorySlug, currentSlug, folderPath) {
  try {
    const entries = await fs.readdir(folderPath, { withFileTypes: true });
    const pageFile = entries.find(
      (entry) => entry.isFile() && entry.name === 'page.tsx',
    );

    if (pageFile) {
      console.log(`Found page.tsx in ${categorySlug}/${currentSlug}`);
      const filePath = path.join(folderPath, pageFile.name);
      const code = await fs.readFile(filePath, 'utf-8');
      const highlightedCode = await codeToHtml(code, {
        lang: 'tsx',
        theme: 'github-dark-default',
        transformers: [
          {
            code(node) {
              node.properties['data-line-numbers'] = '';
            },
          },
        ],
      });

      // Updated: Remove '.page' from the filename
      const cacheFileName = `${categorySlug}.${currentSlug}.json`;
      const cacheFilePath = path.join(cacheBasePath, cacheFileName);

      const cacheData = {
        code,
        highlightedCode,
        filename: 'page.tsx',
        type: 'tsx',
      };
      await ensureCacheDir(cacheBasePath);
      await fs.writeFile(
        cacheFilePath,
        JSON.stringify(cacheData, null, 2),
        'utf-8',
      );
      console.log(`Cached: ${cacheFileName}`);
    } else {
      console.log(`No page.tsx found in ${categorySlug}/${currentSlug}`);
    }
  } catch (error) {
    console.error(`Error processing ${categorySlug}/${currentSlug}:`, error);
  }
}

async function processFolder(categorySlug, currentSlug, folderPath) {
  const entries = await fs.readdir(folderPath, { withFileTypes: true });
  const hasSubDirs = entries.some((entry) => entry.isDirectory());

  if (!hasSubDirs) {
    await processSubCategoryBlocks(categorySlug, currentSlug, folderPath);
  } else {
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const newSlug = `${currentSlug}.${entry.name}`;
        const newFolderPath = path.join(folderPath, entry.name);
        await processFolder(categorySlug, newSlug, newFolderPath);
      }
    }
  }
}

async function generateBlockCaches() {
  try {
    await ensureCacheDir(cacheBasePath);
    const categoryFolders = await fs.readdir(sourcePath, {
      withFileTypes: true,
    });

    for (const categoryEntry of categoryFolders) {
      if (!categoryEntry.isDirectory()) continue;

      const categorySlug = categoryEntry.name;
      const categoryFolder = path.join(sourcePath, categorySlug);
      const subCategoryEntries = await fs.readdir(categoryFolder, {
        withFileTypes: true,
      });

      for (const subCategoryEntry of subCategoryEntries) {
        if (!subCategoryEntry.isDirectory()) continue;

        const subCategorySlug = subCategoryEntry.name;
        const subCategoryFolder = path.join(categoryFolder, subCategorySlug);
        await processFolder(categorySlug, subCategorySlug, subCategoryFolder);
      }
    }

    console.log(
      'Block caches for deepest page.tsx files generated successfully.',
    );
  } catch (error) {
    console.error('Error generating block caches:', error);
  }
}

generateBlockCaches();
