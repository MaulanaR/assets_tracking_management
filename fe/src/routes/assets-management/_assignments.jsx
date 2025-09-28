import Api from '@/utils/axios/api';
import ReactLazyWithSuspense from '@/utils/reactLazyWithSuspense';
import { redirect } from 'react-router';

/** @type {import('react-router').RouteObject[]} */
const routes = [
  {
    path: 'assignments',
    children: [
      {
        index: true,
        loader: () => redirect('/assets-management/assignments/list'),
      },
      {
        path: 'list',
        element: ReactLazyWithSuspense(
          async () =>
            await import(
              '@/pages/assets-management/assignments/content-assignments'
            ),
        ),
        children: [
          {
            path: 'filter',
            element: ReactLazyWithSuspense(
              async () =>
                await import(
                  '@/pages/assets-management/assignments/filter-assignment'
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
              '@/pages/assets-management/assignments/create-assignment'
            ),
        ),
      },
      {
        path: 'edit/:id',
        element: ReactLazyWithSuspense(
          async () =>
            await import(
              '@/pages/assets-management/assignments/edit-assignment'
            ),
        ),
      },
      {
        path: 'transfer/:id',
        element: ReactLazyWithSuspense(
          async () =>
            await import(
              '@/pages/assets-management/assignments/transfer-assignment'
            ),
        ),
      },
      {
        path: 'detail/:id',
        element: ReactLazyWithSuspense(
          async () =>
            await import(
              '@/pages/assets-management/assignments/detail-assignment'
            ),
        ),
      },
      {
        path: 'delete/:id',
        action: async ({ params }) => {
          const { id } = params;
          try {
            const res = await Api().delete(`/api/v1/employee_assets/${id}`);
            return res;
          } catch (error) {
            console.error('Error deleting assignment:', error);
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
