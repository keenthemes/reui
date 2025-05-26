import { resolveBlock } from './files';
import { Preview } from './preview';

export async function PreviewBlock({ path }: { path: string }) {
  // Await the result of resolveBlock to get the resolved PreviewItem | null
  const item = await resolveBlock(path);
  const resolvedPath = '/preview/blocks/' + path;

  console.log('resolvedPath:', resolvedPath);

  if (!item) return null;

  return <Preview mode="block" item={item} path={resolvedPath} />;
}
