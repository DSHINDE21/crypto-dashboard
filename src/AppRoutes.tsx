import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const Dashboard = React.lazy(() => import('@pages/Dashboard'));
const Overview = React.lazy(() => import('@pages/Overview'));
const History = React.lazy(() => import('@pages/History'));
const Header = React.lazy(() => import('@/layouts/Header'));
const Footer = React.lazy(() => import('@/layouts/Footer'));
const LoadingFallback = React.lazy(() => import('@/layouts/LoadingFallback'));

const AppRoutes: React.FC = () => (
  <Suspense fallback={<LoadingFallback />}>
    <Header />
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/overview" element={<Overview />} />
      <Route path="/history" element={<History />} />
      {/* <Route path="/" element={<Dashboard />} /> */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />{' '}
      {/* Default route as no login  there*/}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
    <Footer />
  </Suspense>
);

export default AppRoutes;
