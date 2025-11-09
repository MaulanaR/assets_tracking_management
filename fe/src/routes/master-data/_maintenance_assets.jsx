import Api from '@/utils/axios/api';
import ReactLazyWithSuspense from '@/utils/reactLazyWithSuspense';
import { redirect } from 'react-router';

/** @type {import('react-router').RouteObject[]} */
const routes = [
  {
    path: 'maintenance-assets',
    children: [
      { index: true, loader: () => redirect('/master-data/maintenance-assets/list') },
      {
        path: 'list',
        element: ReactLazyWithSuspense(
          async () => await import('@/pages/master-data/maintenance-assets/content-maintenance-assets'),
        ),
        children: [
          {
            path: 'filter',
            element: ReactLazyWithSuspense(
              async () => await import('@/pages/master-data/maintenance-assets/filter-maintenance-asset'),
            ),
          },
        ],
      },
      {
        path: 'create',
        element: ReactLazyWithSuspense(
          async () => await import('@/pages/master-data/maintenance-assets/create-maintenance-asset'),
        ),
      },
      {
        path: 'edit/:id',
        element: ReactLazyWithSuspense(
          async () => await import('@/pages/master-data/maintenance-assets/edit-maintenance-asset'),
        ),
      },
      {
        path: 'detail/:id',
        element: ReactLazyWithSuspense(
          async () => await import('@/pages/master-data/maintenance-assets/detail-maintenance-asset'),
        ),
      },
      {
        path: 'delete/:id',
        action: async ({ params }) => {
          const { id } = params;
          try {
            const res = await Api().delete(`/api/v1/maintenance_assets/${id}`);
            return res;
          } catch (error) {
            console.error('Error deleting maintenance asset:', error);
          }
        },
      },
      { path: '*', element: ReactLazyWithSuspense(() => import('@/pages/notfound')) },
    ],
  },
];

export default routes;