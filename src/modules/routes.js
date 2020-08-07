export default [
  {
    path: '/auth',
    chunks: ['auth'],
    children: true,
    load: () => import(/* webpackChunkName: 'auth' */ 'modules/auth'),
  },

  {
    path: '/account',
    chunks: ['account'],
    children: true,
    requireAuth: true,
    load: () => import(/* webpackChunkName: 'account' */ 'modules/account'),
  },

  {
    path: '/personal',
    chunks: ['personal'],
    children: true,
    requireAuth: true,
    load: () => import(/* webpackChunkName: 'personal' */ 'modules/personal'),
  },

  {
    path: '/table',
    chunks: ['table'],
    children: true,
    requireAuth: true,
    load: () => import(/* webpackChunkName: 'personal' */ 'modules/table'),
  },

  {
    path: '/',
    chunks: ['home'],
    children: true,
    requireAuth: true,
    load: () => import(/* webpackChunkName: 'home' */ 'modules/home'),
  },

  {
    path: '/(.*)',
    chunks: ['not-found'],
    featureGroup: 'NOT_FOUND',
    requireAuth: true,
    load: () => import(/* webpackChunkName: 'not-found' */ 'modules/not-found'),
  },
];
