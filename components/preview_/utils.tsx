import { codeToHtml } from 'shiki';

export function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export function convertScriptComments(input: string): string {
  // Regular expression to match <script><!-- {Some comment} --></script>
  const regex = /<script>\s*<!--([\s\S]*?)-->\s*<\/script>/g;

  // Replace matches with just the HTML comment <!-- {Some comment} -->
  return input.replace(regex, (match, comment) => `<!--${comment.trim()}-->`);
}

export async function highlightCode(code: string, lang: string) {
  const html = await codeToHtml(code, {
    lang: lang,
    theme: 'github-dark-default',
    transformers: [
      {
        code(node) {
          node.properties['data-line-numbers'] = '1';
        },
      },
    ],
  });

  return html;
}

