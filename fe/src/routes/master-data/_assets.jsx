import Api from '@/utils/axios/api';
import ReactLazyWithSuspense from '@/utils/reactLazyWithSuspense';
import { redirect } from 'react-router';

/** @type {import('react-router').RouteObject[]} */
const routes = [
  {
    path: 'assets',
    children: [
      {
        index: true,
        loader: () => redirect('/master-data/assets/list'),
      },
      {
        path: 'list',
        element: ReactLazyWithSuspense(
          async () => await import('@/pages/master-data/assets/content-assets'),
        ),
        children: [
          {
            path: 'filter',
            element: ReactLazyWithSuspense(
              async () =>
                await import('@/pages/master-data/assets/filter-asset'),
            ),
          },
        ],
      },
      {
        path: 'create',
        element: ReactLazyWithSuspense(
          async () => await import('@/pages/master-data/assets/create-asset'),
        ),
      },
      {
        path: 'edit/:id',
        element: ReactLazyWithSuspense(
          async () => await import('@/pages/master-data/assets/edit-asset'),
        ),
      },
      {
        path: 'detail/:id',
        element: ReactLazyWithSuspense(
          async () => await import('@/pages/master-data/assets/detail-asset'),
        ),
      },
      {
        path: 'delete/:id',
        action: async ({ params }) => {
          const { id } = params;
          try {
            const res = await Api().delete(`/api/v1/assets/${id}`);
            return res;
          } catch (error) {
            console.error('Error deleting asset:', error);
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
