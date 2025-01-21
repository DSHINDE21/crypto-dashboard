import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Dashboard = React.lazy(() => import('@pages/Dashboard'));
const Overview = React.lazy(() => import('@pages/Overview'));
const History = React.lazy(() => import('@pages/History'));
const Header = React.lazy(() => import('@components/charts/Header'));
const Footer = React.lazy(() => import('@components/charts/Footer'));

const AppRoutes: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Header />
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/overview" element={<Overview />} />
      <Route path="/history" element={<History />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
    <Footer />
  </Suspense>
);

export default AppRoutes;
