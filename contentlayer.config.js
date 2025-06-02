import { getHighlighter } from '@shikijs/compat';
import { defineDocumentType, defineNestedType, makeSource } from 'contentlayer2/source-files';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import { codeImport } from 'remark-code-import';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
  slug: {
    type: 'string',
    resolve: (doc) => `/${doc._raw.flattenedPath.replace(/\(.*?\)\//g, '')}`, // Removes any folder wrapped in parentheses
  },
  slugAsParams: {
    type: 'string',
    resolve: (doc) =>
      doc._raw.flattenedPath
        .replace(/\(.*?\)\//g, '') // Removes any folder wrapped in parentheses
        .split('/')
        .slice(1)
        .join('/'),
  },
};

const LinkItem = defineNestedType(() => ({
  name: 'LinkItem',
  fields: {
    label: {
      type: 'string',
      description: 'The label for the link',
      required: true,
    },
    url: {
      type: 'string',
      description: 'The URL for the link',
      required: true,
    },
  },
}));

export const Doc = defineDocumentType(() => ({
  name: 'Doc',
  filePathPattern: `docs/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    published: {
      type: 'boolean',
      default: true,
    },
    links: {
      type: 'list',
      of: LinkItem,
      description: 'A list of related links',
      required: false,
    },
    featured: {
      type: 'boolean',
      default: false,
      required: false,
    },
    component: {
      type: 'boolean',
      default: false,
      required: false,
    },
    toc: {
      type: 'boolean',
      default: true,
      required: false,
    },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Doc],
  mdx: {
    remarkPlugins: [remarkGfm, codeImport],
    rehypePlugins: [
      rehypeSlug,
      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === 'element' && node?.tagName === 'pre') {
            const [codeEl] = node.children;
            if (codeEl.tagName !== 'code') {
              return;
            }

            if (codeEl.data?.meta) {
              // Extract event from meta and pass it down the tree.
              const regex = /event="([^"]*)"/;
              const match = codeEl.data?.meta.match(regex);
              if (match) {
                node.__event__ = match ? match[1] : null;
                codeEl.data.meta = codeEl.data.meta.replace(regex, '');
              }
            }

            node.__rawString__ = codeEl.children?.[0].value;
            node.__src__ = node.properties?.__src__;
            node.__style__ = node.properties?.__style__;
          }
        });
      },
      [
        rehypePrettyCode,
        {
          theme: 'github-dark',
          getHighlighter,
          onVisitLine(node) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }];
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className.push('line--highlighted');
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ['word--highlighted'];
          },
        },
      ],
      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === 'element' && node?.tagName === 'div') {
            if (!('data-rehype-pretty-code-fragment' in node.properties)) {
              return;
            }

            const preElement = node.children.at(-1);
            if (preElement.tagName !== 'pre') {
              return;
            }

            preElement.properties['__withMeta__'] = node.children.at(0).tagName === 'div';
            preElement.properties['__rawString__'] = node.__rawString__;

            if (node.__src__) {
              preElement.properties['__src__'] = node.__src__;
            }

            if (node.__event__) {
              preElement.properties['__event__'] = node.__event__;
            }

            if (node.__style__) {
              preElement.properties['__style__'] = node.__style__;
            }
          }
        });
      },
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['heading'],
            ariaLabel: 'Link to section',
          },
          content: (node) => {
            // Only apply to h2 and h3
            if (node.tagName === 'h2' || node.tagName === 'h3') {
              return [
                {
                  type: 'element',
                  tagName: 'svg',
                  properties: {
                    xmlns: 'http://www.w3.org/2000/svg',
                    width: '16',
                    height: '16',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: '2',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    className: 'lucide lucide-hash heading-icon',
                  },
                  children: [
                    {
                      type: 'element',
                      tagName: 'line',
                      properties: { x1: '4', y1: '9', x2: '20', y2: '9' },
                    },
                    {
                      type: 'element',
                      tagName: 'line',
                      properties: { x1: '4', y1: '15', x2: '20', y2: '15' },
                    },
                    {
                      type: 'element',
                      tagName: 'line',
                      properties: { x1: '10', y1: '3', x2: '8', y2: '21' },
                    },
                    {
                      type: 'element',
                      tagName: 'line',
                      properties: { x1: '16', y1: '3', x2: '14', y2: '21' },
                    },
                  ],
                },
              ];
            }

            // Return an empty array for other heading levels (h1, h4, etc.)
            return [];
          },
        },
      ],
    ],
  },
});
