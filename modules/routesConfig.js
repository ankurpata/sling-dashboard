const routesConfig = [
  {
    id: 'dashboards',
    title: 'Home',
    messageId: 'sidebar.app.home',
    type: 'item',
    icon: 'home',
    url: '/dashboards/analytics',
  },
  {
    id: 'pages',
    title: 'Page Templates',
    messageId: 'sidebar.app.pagesTemplates',
    type: 'item',
    icon: 'insert_chart',
    url: '/pages/',
  },
  {
    id: 'headless-apis',
    title: 'Apis',
    messageId: 'sidebar.app.backendApis',
    type: 'item',
    icon: 'storage',
    url: '/headless-apis',
  },
  {
    id: 'routes',
    title: 'Routes',
    messageId: 'sidebar.app.routes',
    type: 'item',
    icon: 'swap_vert',
    url: '/routes',
  },
  {
    id: 'widgets',
    title: 'Widgets',
    messageId: 'sidebar.app.widgets',
    type: 'item',
    icon: 'widgets',
    url: '/widgets',
  },
  {
    id: 'media',
    title: 'Media',
    messageId: 'sidebar.app.media',
    type: 'item',
    icon: 'photo_camera',
    url: '/media',
  },
  {
    id: 'settings',
    title: 'Settings',
    messageId: 'sidebar.app.settings',
    type: 'item',
    icon: 'settings',
    url: '/settings',
  },
  {
    id: 'sitemap',
    title: 'SiteMap',
    messageId: 'sidebar.app.sitemap',
    type: 'item',
    disabled: true,
    icon: 'account_tree',
    url: '/sitemap',
  },
  {
    id: 'amp',
    title: 'Amp Pages & Stories',
    messageId: 'sidebar.app.ampPages',
    type: 'item',
    disabled: true,
    icon: 'amp_stories',
    url: '/dashboards/amp',
  },
  {
    id: 'emailers',
    title: 'Emailers',
    messageId: 'sidebar.app.emailers',
    type: 'item',
    disabled: true,
    icon: 'mail-outline',
    url: '/emailers',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    messageId: 'sidebar.app.analytics',
    type: 'item',
    icon: 'timeline',
    disabled: true,
    url: '/analytics',
  },
  {
    id: 'buildDeploy',
    title: 'Build & Deploy',
    messageId: 'sidebar.app.buildDeploy',
    type: 'item',
    disabled: true,
    icon: 'build',
    url: '/deploy',
  },
];
export default routesConfig;
