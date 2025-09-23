import Api from '@/utils/axios/api';
import ReactLazyWithSuspense from '@/utils/reactLazyWithSuspense';
import { redirect } from 'react-router';

/** @type {import('react-router').RouteObject[]} */
const routes = [
  {
    path: 'branches',
    children: [
      {
        index: true,
        loader: () => redirect('/master-data/branches/list'),
      },
      {
        path: 'list',
        element: ReactLazyWithSuspense(
          async () =>
            await import('@/pages/master-data/branches/content-branches'),
        ),
        children: [
          {
            path: 'filter',
            element: ReactLazyWithSuspense(
              async () =>
                await import('@/pages/master-data/branches/filter-branch'),
            ),
          },
        ],
      },
      {
        path: 'create',
        element: ReactLazyWithSuspense(
          async () =>
            await import('@/pages/master-data/branches/create-branch'),
        ),
      },
      {
        path: 'edit/:id',
        element: ReactLazyWithSuspense(
          async () => await import('@/pages/master-data/branches/edit-branch'),
        ),
      },
      {
        path: 'detail/:id',
        element: ReactLazyWithSuspense(
          async () =>
            await import('@/pages/master-data/branches/detail-branch'),
        ),
      },
      {
        path: 'delete/:id',
        action: async ({ params }) => {
          const { id } = params;
          try {
            const res = await Api().delete(`/api/v1/branches/${id}`);
            return res;
          } catch (error) {
            console.error('Error deleting branch:', error);
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
