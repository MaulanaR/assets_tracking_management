import ReactLazyWithSuspense from '@/utils/reactLazyWithSuspense';
import contacts from './_contacts';

/** @type {import('react-router').RouteObject[]} */
const routes = [
  {
    path: 'datastores',
    children: [
      {
        index: true,
        element: ReactLazyWithSuspense(
          async () => await import('@/pages/datastores/datastores'),
        ),
      },
      ...contacts,
      {
        path: '*',
        element: ReactLazyWithSuspense(() => import('@/pages/notfound')),
      },
    ],
  },
];

export default routes;
