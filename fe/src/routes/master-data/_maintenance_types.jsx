import Api from '@/utils/axios/api';
import ReactLazyWithSuspense from '@/utils/reactLazyWithSuspense';
import { redirect } from 'react-router';

/** @type {import('react-router').RouteObject[]} */
const routes = [
  {
    path: 'maintenance-types',
    children: [
      {
        index: true,
        loader: () => redirect('/master-data/maintenance-types/list'),
      },
      {
        path: 'list',
        element: ReactLazyWithSuspense(
          async () =>
            await import(
              '@/pages/master-data/maintenance-types/content-maintenance-types'
            ),
        ),
        children: [
          {
            path: 'filter',
            element: ReactLazyWithSuspense(
              async () =>
                await import(
                  '@/pages/master-data/maintenance-types/filter-maintenance-type'
                ),
            ),
          },
        ],
      },
      {
        path: 'create',
        element: ReactLazyWithSuspense(
          async () =>
            await import(
              '@/pages/master-data/maintenance-types/create-maintenance-type'
            ),
        ),
      },
      {
        path: 'edit/:id',
        element: ReactLazyWithSuspense(
          async () =>
            await import(
              '@/pages/master-data/maintenance-types/edit-maintenance-type'
            ),
        ),
      },
      {
        path: 'detail/:id',
        element: ReactLazyWithSuspense(
          async () =>
            await import(
              '@/pages/master-data/maintenance-types/detail-maintenance-type'
            ),
        ),
      },
      {
        path: 'delete/:id',
        action: async ({ params }) => {
          const { id } = params;
          try {
            const res = await Api().delete(`/api/v1/maintenance_types/${id}`);
            return res;
          } catch (error) {
            console.error('Error deleting maintenance type:', error);
          }
        },
      },
      {
        path: '*',
        element: ReactLazyWithSuspense(() => import('@/pages/notfound')),
      },
    ],
  },
];

export default routes;