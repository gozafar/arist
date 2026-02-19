'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { me } from '@/lib/api/auth';

const baseNavItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/paintings', label: 'Paintings' },
  { href: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const pathname = usePathname();
  // const { totalItems } = useCart();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const session = await me();
        if (isMounted) {
          if (session?.user?.role) {
            const role = session.user.role;
            setIsAdmin(role === 'ADMIN' || role === 'SUPER_ADMIN');
          }
        }
      } catch {
        if (isMounted) {
          setIsAdmin(false);
        }
      }

      if (isMounted) {
        setCheckedAuth(true);
      }
    };

    void checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const authNavItem =
    checkedAuth && isAdmin ? { href: '/admin/paintings', label: 'Admin' } : { href: '/admin/login', label: 'Login' };
  const navItems = [...baseNavItems, authNavItem];

  const linkClass = (href: string) =>
    `relative px-3 py-2 text-sm font-medium transition ${
      pathname === href || (href === '/paintings' && pathname.startsWith('/paintings/'))
        ? 'text-[#0ac9bc] font-semibold'
        : 'text-black/80 '
    }`;

  return (
    <header className='sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-white/15'>
      <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6'>
        <Link href='/' className='flex items-center gap-3'>
          <img
            src='/favicon.svg'
            alt='Rakhis Studio Logo'
            className='h-10 w-10 rounded-full shadow-card'
            width={40}
            height={40}
          />
          <div>
            <p className='text-xs uppercase tracking-[0.35em] text-black/60'>Rakhi&apos;s Studio</p>
            <p className='font-display text-xl text-black font-semibold'>Online Gallery</p>
          </div>
        </Link>

        <nav className='hidden items-center gap-2 md:flex'>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              {item.label}
            </Link>
          ))}
          {/* <Link
            href="/cart"
            className="relative rounded-full border border-white/20 px-4 py-2 text-sm text-black hover:border-white/30 hover:text-sand-700"
          >
            Cart
            <span className="ml-2 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-sand-500 px-2 text-xs font-semibold text-black shadow-card">
              {totalItems}
            </span>
          </Link> */}
        </nav>

        <button
          className='md:hidden rounded-full border border-white/20 p-2 text-black'
          onClick={() => setOpen(!open)}
          aria-label='Toggle navigation'
        >
          <div className='flex flex-col gap-1'>
            <span className='block h-0.5 w-5 bg-black' />
            <span className='block h-0.5 w-5 bg-black' />
            <span className='block h-0.5 w-5 bg-black' />
          </div>
        </button>
      </div>

      {open && (
        <div className='md:hidden border-t border-white/15 bg-white/90'>
          <div className='mx-auto flex max-w-6xl flex-col px-4 py-4 gap-3 text-sm'>
            {navItems.map(item => (
              <Link key={item.href} href={item.href} className={linkClass(item.href)} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            {/* <Link
              href="/cart"
              className="flex items-center justify-between rounded-xl border border-white/20 px-4 py-3 text-black"
              onClick={() => setOpen(false)}
            >
              <span>Cart</span>
              <span className="ml-2 inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-full bg-sand-500 px-2 text-xs font-semibold text-black shadow-card">
                {totalItems}
              </span>
            </Link> */}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
