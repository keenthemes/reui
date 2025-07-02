import { BlocksConfig } from './types';

export const blocksConfig: BlocksConfig = [
  {
    title: 'Application UI',
    slug: 'application-ui',
    description: 'Complete layout for apps',
    sub: [
      {
        title: 'Sub-category title',
        slug: 'slug',
        sub: [
          {
            title: 'Sub-category title',
            slug: 'slug',
            blocks: [
              {
                id: '1',
                title: '',
                published: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Marketing',
    slug: 'marketing',
    description: 'Complete layout for apps',
    sub: [
      {
        title: 'Headers',
        slug: 'headers',
      },
    ],
  },
  {
    title: 'Onboarding',
    slug: 'onboarding',
    description: 'Complete layout for apps',
    sub: [
      {
        title: 'Headers',
        slug: 'headers',
      },
    ],
  },
  {
    title: 'E-commerce',
    slug: 'e-commerce',
    description: 'Complete layout for apps',
    sub: [
      {
        title: 'Headers',
        slug: 'headers',
      },
    ],
  },
];
