import ReactLazyWithSuspense from '@/utils/reactLazyWithSuspense';

/** @type {import('react-router').RouteObject[]} */
const routes = [
  {
    path: 'assets-management',
    children: [
      {
        index: true,
        element: ReactLazyWithSuspense(
          async () =>
            await import('@/pages/assets-management/assets-management'),
        ),
      },
      {
        path: '*',
        element: ReactLazyWithSuspense(() => import('@/pages/notfound')),
      },
    ],
  },
];

export default routes;
