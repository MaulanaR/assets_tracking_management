import ReactLazyWithSuspense from '@/utils/reactLazyWithSuspense';
import branches from './_branches';
import categories from './_categories';
import employees from './_employees';
import departments from './_departments';
import conditions from './_conditions';

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
      ...employees,
      ...departments,
      ...conditions,
      {
        path: '*',
        element: ReactLazyWithSuspense(() => import('@/pages/notfound')),
      },
    ],
  },
];

export default routes;
