import ReactLazyWithSuspense from '@/utils/reactLazyWithSuspense';
import assets from './_assets';
import branches from './_branches';
import categories from './_categories';
import conditions from './_conditions';
import departments from './_departments';
import employees from './_employees';

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
      ...assets,
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
