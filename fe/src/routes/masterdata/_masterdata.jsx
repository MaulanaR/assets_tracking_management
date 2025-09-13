import ReactLazyWithSuspense from '@/utils/reactLazyWithSuspense';
import branches from './_branches';
import categories from './_categories';

/** @type {import('react-router').RouteObject[]} */
const routes = [
  {
    path: 'masterdata',
    children: [
      {
        index: true,
        element: ReactLazyWithSuspense(
          async () => await import('@/pages/masterdata/masterdata'),
        ),
      },
      ...branches,
      ...categories,
      {
        path: '*',
        element: ReactLazyWithSuspense(() => import('@/pages/notfound')),
      },
    ],
  },
];

export default routes;
