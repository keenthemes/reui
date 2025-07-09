import { BlocksConfig } from './types';

export const blocksConfig: BlocksConfig = [
  {
    title: 'Application',
    default: true,
    slug: 'application',
    description: 'Essential components for modern applications',
    sub: [
      {
        title: 'Charts',
        slug: 'charts',
        sub: [
          {
            title: 'Line Charts',
            slug: 'line-charts',
            published: true,
            new: true,
            blocks: [],
          },
          {
            title: 'Bar Charts',
            slug: 'bar-charts',
            published: true,
            new: true,
            blocks: [],
          },
          {
            title: 'Pie Charts',
            slug: 'pie-charts',
            published: true,
            new: true,
            blocks: [],
          },
          {
            title: 'Doughnut Charts',
            slug: 'doughnut-charts',
            published: true,
            new: true,
            blocks: [],
          },
          {
            title: 'Radar Charts',
            slug: 'radar-charts',
            published: true,
            new: true,
            blocks: [],
          },
          {
            title: 'Scatter Charts',
            slug: 'scatter-charts',
            published: true,
            new: true,
            blocks: [],
          },
          {
            title: 'Bubble Charts',
            slug: 'bubble-charts',
            published: true,
            new: true,
            blocks: [],
          },
          {
            title: 'Polar Area Charts',
            slug: 'polar-area-charts',
            published: true,
            new: true,
            blocks: [],
          },
        ],
      },
      {
        title: 'Navigation',
        slug: 'navigation',
        sub: [
          {
            title: 'Dropdowns',
            slug: 'dropdowns',
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
            blocks: [],
          },
          {
            title: 'Tabs',
            slug: 'tabs',
            blocks: [],
          },
          {
            title: 'Breadcrumbs',
            slug: 'breadcrumbs',
            blocks: [],
          },
          {
            title: 'Vertical Navigation',
            slug: 'vertical-nav',
            blocks: [],
          },
        ],
      },
      {
        title: 'Forms',
        slug: 'forms',
        sub: [
          {
            title: 'Single Column Form',
            slug: 'single-column',
            blocks: [],
          },
          {
            title: 'Multi Column Form',
            slug: 'multi-column',
            blocks: [],
          },
          { title: 'Wizard Forms', slug: 'wizard-forms', blocks: [] },
          { title: 'Modal Forms', slug: 'modal-forms', blocks: [] },
          { title: 'Text Inputs', slug: 'text-inputs', blocks: [] },
          {
            title: 'Select Dropdowns',
            slug: 'select-dropdowns',
            blocks: [],
          },
          { title: 'Checkboxes', slug: 'checkboxes', blocks: [] },
          {
            title: 'Radio Buttons',
            slug: 'radio-buttons',
            blocks: [],
          },
          { title: 'Date Pickers', slug: 'date-pickers', blocks: [] },
          { title: 'File Upload', slug: 'file-upload', blocks: [] },
          {
            title: 'Rich Text Editor',
            slug: 'rich-text',
            blocks: [],
          },
          {
            title: 'Form Validation',
            slug: 'form-validation',
            blocks: [],
          },
          {
            title: 'Search Forms',
            slug: 'search-forms',
            blocks: [],
          },
          {
            title: 'Contact Forms',
            slug: 'contact-forms',
            blocks: [],
          },
          {
            title: 'Registration Forms',
            slug: 'registration-forms',
            blocks: [],
          },
        ],
      },
      {
        title: 'Feedback',
        slug: 'feedback',
        sub: [
          {
            title: 'Success Alerts',
            slug: 'success-alerts',
            blocks: [],
          },
          {
            title: 'Error Alerts',
            slug: 'error-alerts',
            blocks: [],
          },
          {
            title: 'Warning Alerts',
            slug: 'warning-alerts',
            blocks: [],
          },
          { title: 'Info Alerts', slug: 'info-alerts', blocks: [] },
          {
            title: 'Toast Notifications',
            slug: 'toast-notifications',
            blocks: [],
          },
          {
            title: 'Push Notifications',
            slug: 'push-notifications',
            blocks: [],
          },
          {
            title: 'Loading Spinners',
            slug: 'spinners',
            blocks: [],
          },
          {
            title: 'Progress Bars',
            slug: 'progress-bars',
            blocks: [],
          },
          {
            title: 'Skeleton Loaders',
            slug: 'skeleton-loaders',
            blocks: [],
          },
          {
            title: 'Empty States',
            slug: 'empty-states',
            blocks: [],
          },
          { title: 'Error States', slug: 'error-states', blocks: [] },
          {
            title: 'Confirmation Dialogs',
            slug: 'confirmation-dialogs',
            blocks: [],
          },
          { title: 'Tooltips', slug: 'tooltips', blocks: [] },
        ],
      },
      {
        title: 'Layout',
        slug: 'layout',
        sub: [
          {
            title: 'App Headers',
            slug: 'app-headers',
            blocks: [],
          },
          {
            title: 'Page Headers',
            slug: 'page-headers',
            blocks: [],
          },
          {
            title: 'Section Headers',
            slug: 'section-headers',
            blocks: [],
          },
          {
            title: 'Left Sidebar',
            slug: 'left-sidebar',
            blocks: [],
          },
          {
            title: 'Right Sidebar',
            slug: 'right-sidebar',
            blocks: [],
          },
          {
            title: 'Main Content',
            slug: 'main-content',
            blocks: [],
          },
          {
            title: 'Split Layouts',
            slug: 'split-layouts',
            blocks: [],
          },
          { title: 'Grid Layouts', slug: 'grid-layouts', blocks: [] },
          { title: 'App Footers', slug: 'footers', blocks: [] },
          { title: 'Info Panels', slug: 'panels', blocks: [] },
          { title: 'Modal Dialogs', slug: 'modals', blocks: [] },
        ],
      },
    ],
  },
  {
    title: 'Marketing',
    slug: 'marketing',
    description: 'Components for marketing websites and landing pages',
    sub: [
      {
        title: 'Hero Sections',
        slug: 'hero-sections',
        sub: [
          {
            title: 'Simple Heroes',
            slug: 'simple-heroes',
            blocks: [],
          },
          {
            title: 'Video Heroes',
            slug: 'video-heroes',
            blocks: [],
          },
          {
            title: 'Split Heroes',
            slug: 'split-heroes',
            blocks: [],
          },
          {
            title: 'Gradient Heroes',
            slug: 'gradient-heroes',
            blocks: [],
          },
          {
            title: 'Animated Heroes',
            slug: 'animated-heroes',
            blocks: [],
          },
          {
            title: 'Carousel Heroes',
            slug: 'carousel-heroes',
            blocks: [],
          },
        ],
      },
      {
        title: 'Features',
        slug: 'features',
        sub: [
          {
            title: 'Feature Grids',
            slug: 'feature-grids',
            blocks: [],
          },
          {
            title: 'Feature Lists',
            slug: 'feature-lists',
            blocks: [],
          },
          {
            title: 'Comparison Tables',
            slug: 'comparison',
            blocks: [],
          },
          { title: 'Benefits', slug: 'benefits', blocks: [] },
          { title: 'Icon Features', slug: 'icon-features', blocks: [] },
          {
            title: 'Alternating Features',
            slug: 'alternating-features',
            blocks: [],
          },
        ],
      },
      {
        title: 'Testimonials',
        slug: 'testimonials',
        sub: [
          { title: 'Customer Reviews', slug: 'reviews', blocks: [] },
          {
            title: 'Case Studies',
            slug: 'case-studies',
            blocks: [],
          },
          {
            title: 'Social Proof',
            slug: 'social-proof',
            blocks: [],
          },
          {
            title: 'Video Testimonials',
            slug: 'video-testimonials',
            blocks: [],
          },
          {
            title: 'Carousel Testimonials',
            slug: 'carousel-testimonials',
            blocks: [],
          },
        ],
      },
      {
        title: 'Call to Action',
        slug: 'cta',
        sub: [
          {
            title: 'Newsletter Signup',
            slug: 'newsletter',
            blocks: [],
          },
          {
            title: 'Download CTA',
            slug: 'download-cta',
            blocks: [],
          },
          { title: 'Contact CTA', slug: 'contact-cta', blocks: [] },
          { title: 'Trial CTA', slug: 'trial-cta', blocks: [] },
          { title: 'Demo CTA', slug: 'demo-cta', blocks: [] },
        ],
      },
      {
        title: 'Pricing',
        slug: 'pricing',
        sub: [
          {
            title: 'Pricing Tables',
            slug: 'pricing-tables',
            blocks: [],
          },
          {
            title: 'Simple Pricing',
            slug: 'simple-pricing',
            blocks: [],
          },
          {
            title: 'Feature Pricing',
            slug: 'feature-pricing',
            blocks: [],
          },
          {
            title: 'Toggle Pricing',
            slug: 'toggle-pricing',
            blocks: [],
          },
        ],
      },
      {
        title: 'Team',
        slug: 'team',
        sub: [
          { title: 'Team Grids', slug: 'team-grids', blocks: [] },
          { title: 'Team Cards', slug: 'team-cards', blocks: [] },
          { title: 'Leadership', slug: 'leadership', blocks: [] },
          { title: 'About Us', slug: 'about-us', blocks: [] },
        ],
      },
      {
        title: 'Social Proof',
        slug: 'social-proof',
        sub: [
          { title: 'Logo Clouds', slug: 'logo-clouds', blocks: [] },
          {
            title: 'Partner Logos',
            slug: 'partner-logos',
            blocks: [],
          },
          {
            title: 'Press Logos',
            slug: 'press-logos',
            blocks: [],
          },
          {
            title: 'Scrolling Logos',
            slug: 'scrolling-logos',
            blocks: [],
          },
        ],
      },
      {
        title: 'Statistics',
        slug: 'statistics',
        sub: [
          { title: 'Number Stats', slug: 'number-stats', blocks: [] },
          {
            title: 'Counter Stats',
            slug: 'counter-stats',
            blocks: [],
          },
          {
            title: 'Progress Stats',
            slug: 'progress-stats',
            blocks: [],
          },
          {
            title: 'Achievement Stats',
            slug: 'achievement-stats',
            blocks: [],
          },
        ],
      },
      {
        title: 'FAQ',
        slug: 'faq',
        sub: [
          {
            title: 'Accordion FAQ',
            slug: 'accordion-faq',
            blocks: [],
          },
          { title: 'Grid FAQ', slug: 'grid-faq', blocks: [] },
          { title: 'Tabbed FAQ', slug: 'tabbed-faq', blocks: [] },
          { title: 'Search FAQ', slug: 'search-faq', blocks: [] },
        ],
      },
      {
        title: 'Contact',
        slug: 'contact',
        sub: [
          {
            title: 'Contact Forms',
            slug: 'contact-forms',
            blocks: [],
          },
          {
            title: 'Contact Info',
            slug: 'contact-info',
            blocks: [],
          },
          {
            title: 'Map Sections',
            slug: 'map-sections',
            blocks: [],
          },
          {
            title: 'Office Locations',
            slug: 'office-locations',
            blocks: [],
          },
        ],
      },
    ],
  },
  {
    title: 'E-commerce',
    slug: 'e-commerce',
    description: 'Components for online stores and shopping experiences',
    sub: [
      {
        title: 'Layout',
        slug: 'layout',
        sub: [
          {
            title: 'Headers',
            slug: 'headers',
            blocks: [],
          },
          {
            title: 'Heroes',
            slug: 'heroes',
            blocks: [],
          },
          {
            title: 'Sidebars',
            slug: 'sidebars',
            blocks: [],
          },
          {
            title: 'Footers',
            slug: 'footers',
            blocks: [],
          },
        ],
      },
      {
        title: 'Product Display',
        slug: 'product-display',
        sub: [
          {
            title: 'Product Cards',
            slug: 'product-cards',
            blocks: [],
          },
          {
            title: 'Product Lists',
            slug: 'product-lists',
            blocks: [],
          },
          {
            title: 'Product Details',
            slug: 'product-details',
            blocks: [],
          },
          {
            title: 'Image Galleries',
            slug: 'image-galleries',
            blocks: [],
          },
          { title: 'Quick View', slug: 'quick-view', blocks: [] },
          {
            title: 'Product Comparison',
            slug: 'product-comparison',
            blocks: [],
          },
        ],
      },
      {
        title: 'Shopping Cart',
        slug: 'shopping-cart',
        sub: [
          { title: 'Cart Items', slug: 'cart-items', blocks: [] },
          {
            title: 'Cart Summary',
            slug: 'cart-summary',
            blocks: [],
          },
          { title: 'Mini Cart', slug: 'mini-cart', blocks: [] },
          {
            title: 'Cart Sidebar',
            slug: 'cart-sidebar',
            blocks: [],
          },
          { title: 'Empty Cart', slug: 'empty-cart', blocks: [] },
        ],
      },
      {
        title: 'Checkout',
        slug: 'checkout',
        sub: [
          {
            title: 'Checkout Forms',
            slug: 'checkout-forms',
            blocks: [],
          },
          {
            title: 'Payment Forms',
            slug: 'payment-forms',
            blocks: [],
          },
          {
            title: 'Shipping Options',
            slug: 'shipping-options',
            blocks: [],
          },
          {
            title: 'Order Review',
            slug: 'order-review',
            blocks: [],
          },
          {
            title: 'Order Confirmation',
            slug: 'order-confirmation',
            blocks: [],
          },
        ],
      },
      {
        title: 'Product Search',
        slug: 'product-search',
        sub: [
          { title: 'Search Bar', slug: 'search-bar', blocks: [] },
          {
            title: 'Search Results',
            slug: 'search-results',
            blocks: [],
          },
          {
            title: 'Search Filters',
            slug: 'search-filters',
            blocks: [],
          },
          {
            title: 'Search Suggestions',
            slug: 'search-suggestions',
            blocks: [],
          },
          {
            title: 'No Results',
            slug: 'no-results',
            blocks: [],
          },
        ],
      },
      {
        title: 'Product Filters',
        slug: 'product-filters',
        sub: [
          {
            title: 'Category Filters',
            slug: 'category-filters',
            blocks: [],
          },
          {
            title: 'Price Filters',
            slug: 'price-filters',
            blocks: [],
          },
          {
            title: 'Attribute Filters',
            slug: 'attribute-filters',
            blocks: [],
          },
          {
            title: 'Brand Filters',
            slug: 'brand-filters',
            blocks: [],
          },
          {
            title: 'Rating Filters',
            slug: 'rating-filters',
            blocks: [],
          },
        ],
      },
      {
        title: 'Customer Features',
        slug: 'customer-features',
        sub: [
          { title: 'Wishlist', slug: 'wishlist', blocks: [] },
          {
            title: 'Recently Viewed',
            slug: 'recently-viewed',
            blocks: [],
          },
          {
            title: 'Product Reviews',
            slug: 'product-reviews',
            blocks: [],
          },
          {
            title: 'Q&A Sections',
            slug: 'qa-sections',
            blocks: [],
          },
          { title: 'Size Guides', slug: 'size-guides', blocks: [] },
        ],
      },
      {
        title: 'Store Navigation',
        slug: 'store-navigation',
        sub: [
          {
            title: 'Category Menu',
            slug: 'category-menu',
            blocks: [],
          },
          {
            title: 'Store Breadcrumbs',
            slug: 'store-breadcrumbs',
            blocks: [],
          },
          { title: 'Store Header', slug: 'store-header', blocks: [] },
          {
            title: 'Account Menu',
            slug: 'account-menu',
            blocks: [],
          },
        ],
      },
      {
        title: 'Promotional',
        slug: 'promotional',
        sub: [
          {
            title: 'Sale Banners',
            slug: 'sale-banners',
            blocks: [],
          },
          { title: 'Coupon Codes', slug: 'coupon-codes', blocks: [] },
          {
            title: 'Featured Products',
            slug: 'featured-products',
            blocks: [],
          },
          {
            title: 'Related Products',
            slug: 'related-products',
            blocks: [],
          },
        ],
      },
    ],
  },
  {
    title: 'Onboarding',
    slug: 'onboarding',
    description: 'User onboarding and getting started components',
    sub: [
      {
        title: 'Authentication',
        slug: 'authentication',
        sub: [
          {
            title: 'Sign In',
            slug: 'sign-in',
            blocks: [],
          },
          {
            title: 'Sign Up',
            slug: 'sign-up',
            blocks: [],
          },
          {
            title: 'Password Reset',
            slug: 'password-reset',
            blocks: [],
          },
          {
            title: 'Two-Factor',
            slug: 'two-factor',
            blocks: [],
          },
        ],
      },
      {
        title: 'Welcome Screens',
        slug: 'welcome-screens',
        sub: [
          {
            title: 'Welcome Messages',
            slug: 'welcome-messages',
            blocks: [],
          },
          {
            title: 'Getting Started',
            slug: 'getting-started',
            blocks: [],
          },
          {
            title: 'Feature Introduction',
            slug: 'feature-intro',
            blocks: [],
          },
          {
            title: 'App Overview',
            slug: 'app-overview',
            blocks: [],
          },
        ],
      },
      {
        title: 'User Setup',
        slug: 'user-setup',
        sub: [
          {
            title: 'Profile Setup',
            slug: 'profile-setup',
            blocks: [],
          },
          {
            title: 'Preferences',
            slug: 'preferences',
            blocks: [],
          },
          {
            title: 'Account Settings',
            slug: 'account-settings',
            blocks: [],
          },
          {
            title: 'Notification Setup',
            slug: 'notification-setup',
            blocks: [],
          },
        ],
      },
      {
        title: 'Progress Tracking',
        slug: 'progress-tracking',
        sub: [
          {
            title: 'Progress Bars',
            slug: 'progress-bars',
            blocks: [],
          },
          {
            title: 'Step Indicators',
            slug: 'step-indicators',
            blocks: [],
          },
          {
            title: 'Completion Status',
            slug: 'completion-status',
            blocks: [],
          },
          {
            title: 'Milestone Tracking',
            slug: 'milestone-tracking',
            blocks: [],
          },
        ],
      },
      {
        title: 'Interactive Tours',
        slug: 'interactive-tours',
        sub: [
          {
            title: 'Product Tours',
            slug: 'product-tours',
            blocks: [],
          },
          {
            title: 'Tour Tooltips',
            slug: 'tour-tooltips',
            blocks: [],
          },
          { title: 'Hotspots', slug: 'hotspots', blocks: [] },
          {
            title: 'Overlay Guides',
            slug: 'overlay-guides',
            blocks: [],
          },
        ],
      },
      {
        title: 'Help & Support',
        slug: 'help-support',
        sub: [
          { title: 'Help Centers', slug: 'help-centers', blocks: [] },
          { title: 'Quick Help', slug: 'quick-help', blocks: [] },
          {
            title: 'Video Tutorials',
            slug: 'video-tutorials',
            blocks: [],
          },
          { title: 'Documentation', slug: 'documentation', blocks: [] },
        ],
      },
      {
        title: 'Engagement',
        slug: 'engagement',
        sub: [
          {
            title: 'Gamification',
            slug: 'gamification',
            blocks: [],
          },
          { title: 'Rewards', slug: 'rewards', blocks: [] },
          { title: 'Challenges', slug: 'challenges', blocks: [] },
          {
            title: 'Social Features',
            slug: 'social-features',
            blocks: [],
          },
        ],
      },
      {
        title: 'Data Collection',
        slug: 'data-collection',
        sub: [
          { title: 'Survey Forms', slug: 'survey-forms', blocks: [] },
          {
            title: 'Feedback Collection',
            slug: 'feedback-collection',
            blocks: [],
          },
          {
            title: 'Interest Selection',
            slug: 'interest-selection',
            blocks: [],
          },
          { title: 'Goal Setting', slug: 'goal-setting', blocks: [] },
        ],
      },
      {
        title: 'Completion',
        slug: 'completion',
        sub: [
          {
            title: 'Success Messages',
            slug: 'success-messages',
            blocks: [],
          },
          { title: 'Next Steps', slug: 'next-steps', blocks: [] },
          {
            title: 'Dashboard Introduction',
            slug: 'dashboard-intro',
            blocks: [],
          },
          {
            title: 'Resource Links',
            slug: 'resource-links',
            blocks: [],
          },
        ],
      },
    ],
  },
];
