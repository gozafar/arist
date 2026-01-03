'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { me } from '@/lib/api/auth';

const AdminGate = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'authorized' | 'unauthorized'>('checking');

  useEffect(() => {
    const check = async () => {
      try {
        const session = await me();
        if (session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN') {
          setStatus('authorized');
          return;
        }
        setStatus('unauthorized');
        router.replace('/403');
      } catch {
        setStatus('unauthorized');
        router.replace('/admin/login');
      }
    };
    void check();
  }, [router]);

  if (status === 'checking') {
    return (
      <div className='mx-auto max-w-4xl px-4 py-16 text-center text-white/70 lg:px-6'>
        <p>Checking admin access…</p>
      </div>
    );
  }

  if (status === 'unauthorized') return null;

  return <>{children}</>;
};

export default AdminGate;
