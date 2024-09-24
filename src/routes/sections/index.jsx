import { Navigate, useRoutes } from 'react-router-dom';
import { authRoutes } from './auth';
import { authDemoRoutes } from './auth-demo';
import { dashboardRoutes } from './dashboard';
// import { mainRoutes } from './main';

export function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />,
    },

    // Auth
    ...authRoutes,
    ...authDemoRoutes,

    // Dashboard
    ...dashboardRoutes,

    // ...mainRoutes,
    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
