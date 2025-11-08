import { Routes, Route } from 'react-router-dom';
import { lazy } from 'react';

// Lazy load dashboard components
const Notices = lazy(() => import('../Notices'));
const Photos = lazy(() => import('../Photos'));
const NotFound = lazy(() => import('../../../Pages/Common/NotFound'));

const AdminDashboardRoutes = () => {
  return (
    <Routes>
      <Route index element={<Notices />} />
      <Route path="notices" element={<Notices />}>
        <Route path="new" element={<Notices action="new" />} />
        <Route path="edit/:id" element={<Notices action="edit" />} />
      </Route>
      <Route path="photos" element={<Photos />}>
        <Route path="upload" element={<Photos action="upload" />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminDashboardRoutes;
