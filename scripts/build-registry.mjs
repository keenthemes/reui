import fs from 'fs/promises';
import path from 'path';

const REGISTRY = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'reui',
  homepage: 'https://reui.io',
  items: [],
};

// List of dependencies to skip from being added to the dependencies array
const SKIP_DEPENDENCIES = ['react', 'react-dom', 'next', 'lucide-react', 'class-variance-authority'];

const REGISTRY_ROOT = path.resolve(process.cwd(), 'registry/default');
const OUTPUT_FILE = path.resolve(process.cwd(), 'registry.json');
const OUTPUT_PUBLIC_FILE = path.resolve(process.cwd(), 'public/r/registry.json');

const FOLDER_TYPE_MAP = {
  blocks: 'registry:block',
  components: 'registry:component',
  hooks: 'registry:hook',
  lib: 'registry:lib',
  ui: 'registry:ui',
};

const DEPENDENCIES_VERSION_MAP = {
  cmdk: 'cmdk@1.1.1',
  recharts: 'recharts@2.15.1',
};

const REGISTRY_DEPENDENCIES = {
  ui: {
    'data-grid': [
      'https://reui.io/r/data-grid-column-filter.json',
      'https://reui.io/r/data-grid-column-header.json',
      'https://reui.io/r/data-grid-column-visibility.json',
      'https://reui.io/r/data-grid-pagination.json',
      'https://reui.io/r/data-grid-table-dnd.json',
      'https://reui.io/r/data-grid-table-dnd-rows.json',
      'https://reui.io/r/data-grid-table.json',
    ],
    // Add other components as needed
  },
  // Add other types as needed
};

async function getFilesRecursive(dir, base = '') {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  let files = [];
  for (const dirent of dirents) {
    const res = path.join(dir, dirent.name);
    const rel = path.join(base, dirent.name);
    if (dirent.isDirectory()) {
      files = files.concat(await getFilesRecursive(res, rel));
    } else if (dirent.isFile() && (dirent.name.endsWith('.ts') || dirent.name.endsWith('.tsx'))) {
      files.push(rel);
    }
  }
  return files;
}

async function buildRegistry() {
  const items = [];
  // Read package.json dependencies
  const pkgJsonPath = path.resolve(process.cwd(), 'package.json');
  const pkgJson = JSON.parse(await fs.readFile(pkgJsonPath, 'utf8'));
  const thirdPartyDeps = pkgJson.dependencies ? Object.keys(pkgJson.dependencies) : [];

  // Helper to extract 3rd-party deps from file content
  function extractThirdPartyDepsFromContent(content) {
    const importRegex = /import\s+[^'";]+['"]([^'";]+)['"]/g;
    const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
    const deps = new Set();
    let match;
    while ((match = importRegex.exec(content))) {
      const dep = match[1];
      // Only consider top-level packages, not relative or aliased imports
      if (!dep.startsWith('.') && !dep.startsWith('@/')) {
        // For scoped packages, keep scope/name only
        const base = dep.startsWith('@') ? dep.split('/').slice(0, 2).join('/') : dep.split('/')[0];
        if (thirdPartyDeps.includes(base)) deps.add(base);
      }
    }
    while ((match = requireRegex.exec(content))) {
      const dep = match[1];
      if (!dep.startsWith('.') && !dep.startsWith('@/')) {
        const base = dep.startsWith('@') ? dep.split('/').slice(0, 2).join('/') : dep.split('/')[0];
        if (thirdPartyDeps.includes(base)) deps.add(base);
      }
    }
    return Array.from(deps);
  }

  for (const [folder, type] of Object.entries(FOLDER_TYPE_MAP)) {
    const absFolder = path.join(REGISTRY_ROOT, folder);
    console.log('type:', type);
    try {
      const files = await getFilesRecursive(absFolder);
      for (const file of files) {
        const parts = file.split(path.sep).map((p) => p.replace(/\.[^/.]+$/, ''));
        const name = type === 'registry:block' ? parts[parts.length - 1] : parts.join('-');
        const relPath = `registry/default/${folder}/${file.replace(/\\/g, '/')}`;
        // Read file content and extract 3rd-party deps

        const absFilePath = path.join(absFolder, file);
        let fileContent = '';
        try {
          fileContent = await fs.readFile(absFilePath, 'utf8');
        } catch (err) {
          console.log('Failed to read file:', absFilePath, err);
        }
        let deps = extractThirdPartyDepsFromContent(fileContent);
        // Filter out skipped dependencies
        deps = deps.filter((dep) => !SKIP_DEPENDENCIES.includes(dep));
        console.log(`[DEBUG] File: ${absFilePath}`);
        console.log(`[DEBUG] Detected dependencies:`, deps);
        // Scan for registry UI and component imports
        const uiImportRegex = /['"]@\/registry\/default\/ui\/([\w-]+)['"]/g;
        const compImportRegex = /['"]@\/registry\/default\/components\/([\w\/-]+)(?:\.tsx)?['"]/g;
        const uiMatches = Array.from(fileContent.matchAll(uiImportRegex));
        const compMatches = Array.from(fileContent.matchAll(compImportRegex));
        const uiDeps = [...new Set(uiMatches.map((m) => `https://reui.io/r/${m[1].replace(/\//g, '-')}.json`))];
        const compDeps = [
          ...new Set(
            compMatches.map((m) => {
              // Remove subfolders, map e.g. data-grid/table-dnd to data-grid-table-dnd
              const depName = m[1].replace(/\//g, '-');
              return `https://reui.io/r/${depName}.json`;
            }),
          ),
        ];
        // Merge all registry deps (UI + component)
        const allRegistryDeps = [...new Set([...uiDeps, ...compDeps])];
        const item = {
          name,
          type,
          dependencies: deps.map((dep) => DEPENDENCIES_VERSION_MAP[dep] || dep),
          files: [
            {
              path: relPath,
              type,
            },
          ],
        };
        // Assign registryDependencies dynamically from REGISTRY_DEPENDENCIES
        const registryDeps = REGISTRY_DEPENDENCIES[folder]?.[name];
        if (registryDeps) {
          item.registryDependencies = registryDeps;
        } else if (allRegistryDeps.length > 0) {
          item.registryDependencies = allRegistryDeps;
        } else if (type === 'registry:component') {
          item.registryDependencies = [];
        }
        items.push(item);
      }
    } catch (e) {
      console.error(e);
      // skip if folder doesn't exist
    }
  }

  // --- Merge static REGISTRY.items into generated items before writing ---
  // Build a lookup map from REGISTRY.items by name|type
  const registryStaticMap = new Map();
  for (const entry of REGISTRY.items) {
    registryStaticMap.set(`${entry.name}|${entry.type}`, entry);
  }
  // Merge static fields into dynamic items
  const mergedItems = items.map((item) => {
    const key = `${item.name}|${item.type}`;
    const staticEntry = registryStaticMap.get(key);
    if (staticEntry) {
      return {
        ...staticEntry,
        ...item,
        cssVars:
          staticEntry.cssVars || item.cssVars ? { ...(staticEntry.cssVars || {}), ...(item.cssVars || {}) } : undefined,
        css: staticEntry.css || item.css ? { ...(staticEntry.css || {}), ...(item.css || {}) } : undefined,
      };
    }
    return item;
  });
  // Write merged registry
  const registryData = {
    ...REGISTRY,
    items: mergedItems,
  };

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(registryData, null, 2));
  console.log(`Registry written to ${OUTPUT_FILE}`);

  // Also write to public directory
  await fs.writeFile(OUTPUT_PUBLIC_FILE, JSON.stringify(registryData, null, 2));
  console.log(`Registry written to ${OUTPUT_PUBLIC_FILE}`);
}

buildRegistry();
