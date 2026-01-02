'use client';

import { ReactNode } from 'react';
import AdminGate from '@/components/admin/AdminGate';
import AdminSidebar from '@/components/admin/AdminSidebar';

const AdminPaintingsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AdminGate>
      <div className='min-h-screen bg-white text-slate-900'>
        <div className='flex'>
          <AdminSidebar />
          <main className='min-h-screen flex-1'>{children}</main>
        </div>
      </div>
    </AdminGate>
  );
};

export default AdminPaintingsLayout;
