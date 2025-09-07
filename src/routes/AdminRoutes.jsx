import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import { useDashboardStats } from '../hooks/useDashboardStats';

// Admin Pages
import Dashboard from '../Pages/Admin/Dashboard';
import Messages from '../Pages/Admin/Messages';
import NoticesManager from '../Pages/Admin/NoticesManager';
import Admission from '../Pages/Admin/Admissions';

// Wrapper component to handle the layout and outlet
const AdminLayoutWrapper = () => {
  const { isLoading: isLoadingStats } = useDashboardStats();
  
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayoutWrapper />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="admissions" element={<Admission />} />
        <Route path="notices" element={<NoticesManager />} />
        <Route path="messages" element={<Messages />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
