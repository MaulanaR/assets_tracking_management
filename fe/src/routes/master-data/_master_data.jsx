import ReactLazyWithSuspense from '@/utils/reactLazyWithSuspense';
import assets from './_assets';
import branches from './_branches';
import categories from './_categories';
import conditions from './_conditions';
import departments from './_departments';
import employees from './_employees';
import maintenance_types from './_maintenance_types';
import maintenance_assets from './_maintenance_assets';

/** @type {import('react-router').RouteObject[]} */
const routes = [
  {
    path: 'master-data',
    children: [
      {
        index: true,
        element: ReactLazyWithSuspense(
          async () => await import('@/pages/master-data/master-data'),
        ),
      },
      ...assets,
      ...branches,
      ...categories,
      ...employees,
      ...departments,
      ...conditions,
      ...maintenance_types,
      ...maintenance_assets,
      {
        path: '*',
        element: ReactLazyWithSuspense(() => import('@/pages/notfound')),
      },
    ],
  },
];

export default routes;
