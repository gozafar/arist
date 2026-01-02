'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import LogoutModal from './Logout';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/admin/paintings' },
  { label: 'List category', href: '/admin/paintings/list' },
  { label: 'Order list', href: '/admin/paintings/order-list' },
  { label: 'Add new', href: '/admin/paintings/add' },
  { label: 'Add Gallery', href: '/admin/paintings/gallery' },
  { label: 'Contact Messages', href: '/admin/paintings/contact' },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // const handleLogout = async () => {
  //   // await fetch("/api/auth/logout", { method: "POST" });
  //   // Trigger storage event to notify other components
  //   // router.push("/admin/login");
  // };

  return (
    <>
      <aside className='sticky top-0 h-screen w-64 flex-shrink-0 border-r border-slate-200 bg-white/90 px-5 py-6 backdrop-blur'>
        <div className='mb-8'>
          <p className='text-xs uppercase tracking-[0.35em] text-slate-400'>Admin</p>
          <h2 className='mt-2 font-display text-2xl text-slate-900'>Control panel</h2>
        </div>
        <nav className='space-y-2'>
          {navItems.map(item => {
            const isActive = item.href === pathname;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition',
                  isActive
                    ? 'border-slate-300 bg-slate-50 text-slate-900'
                    : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <span>{item.label}</span>
                <span className='text-xs text-slate-400'>›</span>
              </Link>
            );
          })}

          <button
            onClick={() => setShowLogoutModal(true)} // This line needs to be updated
            className='button-primary text-xs ml-4'
          >
            <span>Logout</span>
          </button>
        </nav>
      </aside>
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
    </>
  );
};

export default AdminSidebar;
