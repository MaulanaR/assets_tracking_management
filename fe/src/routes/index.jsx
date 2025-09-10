import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/pages';
import ReactLazyWithSuspense from '@/utils/reactLazyWithSuspense';
import { createBrowserRouter } from 'react-router';
import datastores from './datastores/_datastores';
import reports from './reports/_reports';

const router = createBrowserRouter([
  {
    path: '/auth/login',
    element: ReactLazyWithSuspense(() => import('@/pages/auth/login')),
  },
  {
    path: '/auth/register',
    element: ReactLazyWithSuspense(() => import('@/pages/auth/register')),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: ReactLazyWithSuspense(
          () => import('@/pages/dashboard/dashboard'),
        ),
      },
      {
        path: 'dashboard',
        element: ReactLazyWithSuspense(
          () => import('@/pages/dashboard/dashboard'),
        ),
      },
      {
        path: 'ai',
        element: ReactLazyWithSuspense(() => import('@/pages/ai/groomingAi')),
      },
      ...datastores,
      ...reports,
    ],
  },
  {
    path: '*',
    element: ReactLazyWithSuspense(() => import('@/pages/notfound')),
  },
]);

export default router;
