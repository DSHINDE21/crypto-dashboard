import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const Layout = React.lazy(() => import('@/layouts/Layout'));
const LoadingFallback = React.lazy(() => import('@/layouts/LoadingFallback'));
const Dashboard = React.lazy(() => import('@pages/Dashboard'));
const Overview = React.lazy(() => import('@pages/Overview'));
const History = React.lazy(() => import('@pages/History'));

// TODO: Refactor the routing logic into a centralized "routes" folder.
const routes = [
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/overview', element: <Overview /> },
  { path: '/history', element: <History /> },
  { path: '/', element: <Navigate to="/dashboard" replace /> }, // Default route as no login  there
  { path: '*', element: <div>Page Not Found</div> },
];

const AppRoutes: React.FC = () => (
  <Suspense fallback={<LoadingFallback />}>
    <Layout>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </Layout>
  </Suspense>
);

export default AppRoutes;
