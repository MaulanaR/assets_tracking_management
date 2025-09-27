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
          async () => await import('@/pages/reports/assets/asset-distribution/filter-asset-distribution'),
        ),
      },
      {
        path: 'distribution-asset-per-department',
        element: ReactLazyWithSuspense(
          async () =>
            await import('@/pages/reports/assets/asset-distribution/asset-distribution-per-department'),
        ),
      },
      {
        path: 'filter-asset-condition',
        element: ReactLazyWithSuspense(
          async () => await import('@/pages/reports/assets/asset-condition/filter-asset-condition'),
        ),
      },
      {
        path: 'asset-condition',
        element: ReactLazyWithSuspense(
          async () => await import('@/pages/reports/assets/asset-condition/asset-condition-report'),
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
