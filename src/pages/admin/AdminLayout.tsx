import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/AdminSidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AdminLayout() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 bg-background">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
}
