'use client';

import Link from 'next/link';
import { FiInstagram, FiFacebook, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com',
    icon: FiInstagram,
    hoverClass: 'group-hover:text-pink-600',
    external: true,
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/RakhisArt/',
    icon: FiFacebook,
    hoverClass: 'group-hover:text-blue-600',
    external: true,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/rakhi-vashisht-b373858/',
    icon: FiLinkedin,
    hoverClass: 'group-hover:text-blue-700',
    external: true,
  },
  {
    name: 'Email',
    href: 'mailto:rakhistudio1010@gmail.com',
    icon: FiMail,
    hoverClass: 'group-hover:text-red-500',
    external: false,
  },
];

const Footer = () => {
  return (
    <footer className=' border-t border-sand-200 bg-white/10'>
      <div className='mx-auto max-w-6xl px-4 py-12'>
        <div className='grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Brand */}
          <div>
            <div className='flex flex-col items-center sm:items-start'>
              <div className='mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sand-400 via-sand-500 to-sand-700 shadow-card'>
                <span className='text-xl font-bold text-white'>A</span>
              </div>
              <h3 className='text-lg font-display text-gray-900 font-semibold'>Artistry Gallery</h3>
            </div>

            <p className='mt-3 text-center text-sm text-gray-800 sm:text-left'>
              A curated collection of fine art pieces from talented artists around the world.
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label='Footer navigation'>
            <h4 className='mb-4 text-sm font-display uppercase tracking-wider text-sand-700 text-center sm:text-left font-bold'>
              Quick Links
            </h4>
            <ul className='space-y-2 text-center sm:text-left'>
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/paintings', label: 'Paintings' },
                { href: '/contact', label: 'Contact' },
              ].map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className='group flex items-center justify-center gap-2 text-sm text-gray-800 sm:justify-start'
                  >
                    <span className='transition-transform group-hover:translate-x-1'>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div>
            <h4 className='mb-4 text-sm font-display uppercase tracking-wider text-sand-700 text-center sm:text-left font-bold'>
              Connect
            </h4>

            <ul className='space-y-3'>
              {SOCIAL_LINKS.map(({ name, href, icon: Icon, hoverClass, external }) => (
                <li key={name}>
                  <Link
                    href={href}
                    target={external ? '_blank' : '_self'}
                    rel={external ? 'noopener noreferrer' : undefined}
                    aria-label={name}
                    className='group flex items-center justify-center gap-2 text-sm text-gray-800 sm:justify-start'
                  >
                    <Icon className={`h-5 w-5 text-gray-600 transition-colors ${hoverClass}`} />
                    <span className='transition-transform group-hover:translate-x-1'>{name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className='mb-4 text-sm font-display uppercase tracking-wider text-sand-700 text-center sm:text-left font-bold'>
              Contact Us
            </h4>

            <address className='not-italic text-sm text-gray-800 space-y-3'>
              <div className='flex items-start justify-center gap-2 sm:justify-start'>
                <FiMapPin className='mt-0.5 h-4 w-4 text-sand-600' />
                <div>
                  <p>123 Art Street</p>
                  <p>Mumbai, Maharashtra 400001</p>
                  <p>India</p>
                </div>
              </div>

              <Link
                href='mailto:rakhistudio1010@gmail.com'
                className='flex items-center justify-center gap-2 hover:text-sand-700 sm:justify-start'
              >
                <FiMail className='h-4 w-4 text-gray-800' />
                <span>rakhstudio1010@gmail.com</span>
              </Link>

              <Link
                href='tel:+911234567890'
                className='flex items-center justify-center gap-2 hover:text-sand-700 sm:justify-start'
              >
                <FiPhone className='h-4 w-4 text-gray-800' />
                <span>+852 97236007 | +91 9899757066</span>
              </Link>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-12 flex flex-col items-center justify-between gap-4 border-t border-sand-200 pt-6 text-xs text-gray-800 md:flex-row'>
          <p>© {new Date().getFullYear()} Artistry Gallery. All rights reserved.</p>

          <div className='flex gap-6'>
            <Link href='/terms' className='text-gray-800 hover:text-sand-700'>
              Terms & Conditions
            </Link>
            <Link href='/privacy' className='text-gray-800 hover:text-sand-700'>
              Privacy Policy
            </Link>
          </div>

          <p className='text-gray-800'>Developed by Goitel Consultancy Private Limited</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
