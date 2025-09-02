import { BlocksConfig } from './types';

export const blocksConfig: BlocksConfig = [
  {
    title: 'Cards',
    slug: 'cards',
    published: true,
    default: true,
    sub: [
      {
        title: 'Statistic Cards',
        slug: 'statistic-cards',
        description: `
          15 free modern statistic cards designed to present key metrics and insights. 
          Each card features unique layouts, data visualizations, 
          and styling options. Perfect for dashboards, admin panels, and analytics pages.
        `,
        published: true,
        default: true,
        new: true,
        blocks: [
          {
            slug: 'statistic-card-1',
            previewHeight: 500,
            published: true,
          },
          {
            slug: 'statistic-card-2',
            previewHeight: 500,
            published: true,
          },
          {
            slug: 'statistic-card-3',
            previewHeight: 600,
            published: true,
          },
          {
            slug: 'statistic-card-4',
            previewHeight: 600,
            published: true,
          },
          {
            slug: 'statistic-card-5',
            previewHeight: 600,
            published: true,
          },
          {
            slug: 'statistic-card-6',
            previewHeight: 600,
            published: true,
          },
          {
            slug: 'statistic-card-7',
            previewHeight: 600,
            published: true,
          },
          {
            slug: 'statistic-card-8',
            previewHeight: 600,
            published: true,
          },
          {
            slug: 'statistic-card-9',
            previewHeight: 600,
            published: true,
          },
          {
            slug: 'statistic-card-10',
            previewHeight: 600,
            published: true,
          },
          {
            slug: 'statistic-card-11',
            previewHeight: 600,
            published: true,
          },
          {
            slug: 'statistic-card-12',
            previewHeight: 600,
            published: true,
          },
          {
            slug: 'statistic-card-13',
            previewHeight: 600,
            published: true,
          },
          {
            slug: 'statistic-card-14',
            previewHeight: 600,
            published: true,
          },
          {
            slug: 'statistic-card-15',
            previewHeight: 600,
            published: true,
          },
        ],
      },
      {
        title: 'List Cards',
        slug: 'list-cards',
        published: false,
        description: `
          15 free modern list cards designed to present key metrics and insights. 
          Each card features unique layouts, data visualizations, 
          and styling options. Perfect for dashboards, admin panels, and analytics pages.
        `,
        blocks: [
          {
            slug: 'list-card-1',
            previewHeight: 700,
            published: true,
          },
          {
            slug: 'list-card-2',
            previewHeight: 700,
            published: true,
          },
          {
            slug: 'list-card-3',
            previewHeight: 700,
            published: true,
          },
          {
            slug: 'list-card-4',
            previewHeight: 700,
            published: true,
          },
          {
            slug: 'list-card-5',
            previewHeight: 700,
            published: true,
          },
          {
            slug: 'list-card-6',
            previewHeight: 700,
            published: true,
          },
          {
            slug: 'list-card-7',
            previewHeight: 700,
            published: true,
          },
          {
            slug: 'list-card-8',
            previewHeight: 700,
            published: true,
          },
          {
            slug: 'list-card-9',
            previewHeight: 700,
            published: true,
          },
          {
            slug: 'list-card-10',
            previewHeight: 700,
            published: true,
          },
          {
            slug: 'list-card-11',
            previewHeight: 700,
            published: true,
          },
          {
            slug: 'list-card-12',
            previewHeight: 700,
            published: true,
          },
          {
            slug: 'list-card-13',
            previewHeight: 700,
            published: true,
          },
          {
            slug: 'list-card-14',
            previewHeight: 700,
            published: true,
          },
          {
            slug: 'list-card-15',
            previewHeight: 700,
            published: true,
          },
        ],
      },
      {
        title: 'Table Cards',
        slug: 'table-cards',
        published: false,
        blocks: [],
      },
      {
        title: 'Timeline Cards',
        slug: 'timeline-cards',
        published: false,
        blocks: [],
      },
      {
        title: 'Form Cards',
        slug: 'form-cards',
        published: false,
        blocks: [],
      },
    ],
  },
  {
    title: 'Charts',
    slug: 'charts',
    published: false,
    sub: [
      {
        title: 'Line Charts',
        slug: 'line-charts',
        new: true,
        published: true,
        description: `
          9 free modern line charts designed to present key metrics and insights. 
          Each chart features unique layouts, data visualizations, 
          and styling options. Perfect for dashboards, admin panels, and analytics pages.
        `,
        blocks: [
          {
            slug: 'line-chart-1',
            published: true,
            previewHeight: 700,
          },
          {
            slug: 'line-chart-2',
            published: true,
            previewHeight: 700,
          },
          {
            slug: 'line-chart-3',
            published: true,
            previewHeight: 700,
          },
          {
            slug: 'line-chart-4',
            published: true,
            previewHeight: 700,
          },
          {
            slug: 'line-chart-5',
            published: true,
            previewHeight: 700,
          },
          {
            slug: 'line-chart-6',
            published: true,
            previewHeight: 700,
          },
          {
            slug: 'line-chart-7',
            published: true,
            previewHeight: 700,
          },
          {
            slug: 'line-chart-8',
            published: true,
            previewHeight: 700,
          },
          {
            slug: 'line-chart-9',
            published: true,
            previewHeight: 700,
          },
        ],
      },
      {
        title: 'Area Charts',
        slug: 'area-charts',
        published: true,
        description: `
          5 free modern area charts designed to present key metrics and insights. 
          Each chart features unique layouts, data visualizations, 
          and styling options. Perfect for dashboards, admin panels, and analytics pages.
        `,
        new: true,
        blocks: [
          {
            slug: 'area-chart-1',
            published: true,
            previewHeight: 700,
          },
          {
            slug: 'area-chart-2',
            published: true,
            previewHeight: 700,
          },
          {
            slug: 'area-chart-3',
            published: true,
            previewHeight: 700,
          },
          {
            slug: 'area-chart-4',
            published: true,
            previewHeight: 700,
          },
          {
            slug: 'area-chart-5',
            published: true,
            previewHeight: 700,
          },
        ],
      },
      {
        title: 'Bar Charts',
        slug: 'bar-charts',
        published: false,
        blocks: [],
      },
      {
        title: 'Pie Charts',
        slug: 'pie-charts',
        published: false,
        blocks: [],
      },
      {
        title: 'Doughnut Charts',
        slug: 'doughnut-charts',
        published: false,
        blocks: [],
      },
      {
        title: 'Radar Charts',
        slug: 'radar-charts',
        published: false,
        blocks: [],
      },
    ],
  },
  {
    title: 'Navigation',
    slug: 'navigation',
    published: false,
    sub: [
      {
        title: 'Dropdowns',
        slug: 'dropdowns',
        published: false,
        description: 'Dropdowns are a type of navigation menu that allows users to select an option from a list.',
        blocks: [
          {
            slug: 'dropdown-1',
            published: true,
          },
          {
            slug: 'dropdown-2',
            published: true,
          },
        ],
      },
      {
        title: 'Navbars',
        slug: 'navbars',
        published: false,
        blocks: [],
      },
      {
        title: 'Tabs',
        slug: 'tabs',
        published: false,
        blocks: [],
      },
      {
        title: 'Breadcrumbs',
        slug: 'breadcrumbs',
        published: false,
        blocks: [],
      },
      {
        title: 'Vertical Navigation',
        slug: 'vertical-nav',
        published: false,
        blocks: [],
      },
    ],
  },
  {
    title: 'Lists',
    slug: 'lists',
    published: false,
    sub: [
      {
        title: 'Stacked Lists',
        slug: 'stacked-lists',
        published: false,
        blocks: [],
      },
      {
        title: 'Tables',
        slug: 'tables',
        published: false,
        blocks: [],
      },
      {
        title: 'Data Grids',
        slug: 'data-grids',
        published: false,
        blocks: [],
      },
      {
        title: 'Trees',
        slug: 'trees',
        published: false,
        blocks: [],
      },
      {
        title: 'Feeds',
        slug: 'feeds',
        published: false,
        blocks: [],
      },
    ],
  },
  {
    title: 'Forms',
    slug: 'forms',
    published: false,
    sub: [
      {
        title: 'Form Layouts',
        slug: 'form-layouts',
        blocks: [],
      },
      { title: 'Form Wizards', slug: 'form-wizard', blocks: [] },
      {
        title: 'Form Uploads',
        slug: 'form-uploads',
        blocks: [],
      },
      {
        title: 'Action Forms',
        slug: 'action-forms',
        blocks: [],
      },
      { title: 'Modal Forms', slug: 'modal-forms', blocks: [] },
      { title: 'Drawer Forms', slug: 'drawer-forms', blocks: [] },
    ],
  },
  {
    title: 'Feedback',
    slug: 'feedback',
    published: false,
    sub: [
      {
        title: 'Alerts',
        slug: 'alerts',
        published: false,
        blocks: [],
      },
      {
        title: 'Dialogs',
        slug: 'dialogs',
        published: false,
        blocks: [],
      },
      {
        title: 'Notifications',
        slug: 'notifications',
        published: false,
        blocks: [],
      },
      {
        title: 'Empty States',
        slug: 'empty-states',
        published: false,
        blocks: [],
      },
      {
        title: 'Loading States',
        slug: 'loading-states',
        published: false,
        blocks: [],
      },
      {
        title: 'Overlay Content',
        slug: 'overlay-content',
        published: false,
        blocks: [],
      },
    ],
  },
  {
    title: 'Marketing',
    slug: 'marketing',
    published: false,
    sub: [
      {
        title: 'Hero',
        slug: 'hero',
        published: false,
        blocks: [],
      },
      {
        title: 'Pricing Tables',
        slug: 'pricing-tables',
        published: false,
        blocks: [],
      },
      {
        title: 'Features',
        slug: 'features',
        published: false,
        blocks: [],
      },
      {
        title: 'Call to Action',
        slug: 'call-to-action',
        published: false,
        blocks: [],
      },
      {
        title: 'Testimonials',
        slug: 'testimonials',
        published: false,
        blocks: [],
      },
    ],
  },
];
