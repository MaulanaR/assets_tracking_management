import ReactLazyWithSuspense from '@/utils/reactLazyWithSuspense';
import assignments from './_assignments';
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
      ...assignments,
      {
        path: '*',
        element: ReactLazyWithSuspense(() => import('@/pages/notfound')),
      },
    ],
  },
];

export default routes;
