import ReactLazyWithSuspense from '@/utils/reactLazyWithSuspense';
import financialStatement from './_financial_statement';

/** @type {import('react-router').RouteObject[]} */
const routes = [
  {
    path: 'reports',
    children: [
      {
        index: true,
        element: ReactLazyWithSuspense(
          async () => await import('@/pages/reports/reports'),
        ),
      },
      {
        path: 'filter-distribution-asset',
        element: ReactLazyWithSuspense(
          async () => await import('@/pages/reports/filter-distribution-asset'),
        ),
      },
      {
        path: 'distribution-asset-per-department',
        element: ReactLazyWithSuspense(
          async () =>
            await import('@/pages/reports/distribution-asset-per-department'),
        ),
      },
      ...financialStatement,
      {
        path: '*',
        element: ReactLazyWithSuspense(() => import('@/pages/notfound')),
      },
    ],
  },
];

export default routes;
