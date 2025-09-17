import Api from '@/utils/axios/api';
import ReactLazyWithSuspense from '@/utils/reactLazyWithSuspense';
import { redirect } from 'react-router';

/** @type {import('react-router').RouteObject[]} */
const routes = [
  {
    path: 'conditions',
    children: [
      {
        index: true,
        loader: () => redirect('/masterdata/conditions/list'),
      },
      {
        path: 'list',
        element: ReactLazyWithSuspense(
          async () =>
            await import('@/pages/masterdata/conditions/content-conditions'),
        ),
        children: [
          {
            path: 'filter',
            element: ReactLazyWithSuspense(
              async () =>
                await import('@/pages/masterdata/conditions/filter-condition'),
            ),
          },
        ],
      },
      {
        path: 'create',
        element: ReactLazyWithSuspense(
          async () =>
            await import('@/pages/masterdata/conditions/create-condition'),
        ),
      },
      {
        path: 'edit/:id',
        element: ReactLazyWithSuspense(
          async () =>
            await import('@/pages/masterdata/conditions/edit-condition'),
        ),
      },
      {
        path: 'detail/:id',
        element: ReactLazyWithSuspense(
          async () =>
            await import('@/pages/masterdata/conditions/detail-condition'),
        ),
      },
      {
        path: 'delete/:id',
        action: async ({ params }) => {
          const { id } = params;
          try {
            const res = await Api().delete(`/api/v1/conditions/${id}`);
            return res;
          } catch (error) {
            console.error('Error deleting condition:', error);
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
