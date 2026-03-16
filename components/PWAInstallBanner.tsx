'use client';

import { useState } from 'react';
import { usePWAInstallPrompt } from '@/lib/usePWAInstallPrompt';

export default function PWAInstallBanner() {
  const { isInstallable, promptInstall, dismiss, installed } = usePWAInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  const shouldShow = isInstallable && !dismissed && !installed;

  if (!shouldShow) return null;

  const handleInstall = async () => {
    const choice = await promptInstall();
    if (choice.outcome === 'dismissed') {
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    dismiss();
    setDismissed(true);
  };

  return (
    <div className='fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4'>
      <div className='flex max-w-xl items-center gap-4 rounded-lg bg-white px-4 py-3 shadow-lg ring-1 ring-neutral-200'>
        <div className='flex-1 text-left'>
          <p className='text-sm font-semibold text-neutral-900'>Install Artistry</p>
          <p className='text-xs text-neutral-600'>Add Artistry Gallery to your home screen for faster access.</p>
        </div>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={handleInstall}
            className='rounded-md bg-neutral-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800'
          >
            Install
          </button>
          <button
            type='button'
            onClick={handleDismiss}
            className='rounded-md px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:text-neutral-900'
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
