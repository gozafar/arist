'use client';

import { useEffect, useState } from 'react';

type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageWidth?: string | number;
  imageHeight?: string | number;
  title?: string;
};

export default function ImageModal({
  isOpen,
  onClose,
  imageSrc,
  imageWidth = 2000,
  imageHeight = 2500,
  title = 'Artwork',
}: ImageModalProps) {
  const [loadedImageSrc, setLoadedImageSrc] = useState('');
  const isImageLoading = loadedImageSrc !== imageSrc;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm' onClick={onClose}>
      <div className='relative max-w-[90vw] max-h-[90vh] m-4 ' onClick={e => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-white/80 hover:text-white hover:bg-black/70 transition-all duration-200'
          aria-label='Close modal'
        >
          <svg className='w-6 h-6' fill='none' stroke='black' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>

        {/* Image + Loader */}
        <div className='relative'>
          {isImageLoading && (
            <div className='absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/40 backdrop-blur-[1px]'>
              <div className='h-10 w-10 animate-spin rounded-full border-4 border-black/20 border-t-black/70' />
            </div>
          )}
          <img
            key={imageSrc}
            src={imageSrc}
            alt={title}
            className='max-w-full max-h-[80vh] object-contain rounded-lg'
            onLoad={() => setLoadedImageSrc(imageSrc)}
            onError={() => setLoadedImageSrc(imageSrc)}
          />
        </div>

        {/* Image info */}
        <div className='absolute bottom-10 left-4 text-black/80 text-sm'>
          <p>
            {imageWidth} × {imageHeight} px
          </p>
        </div>
      </div>
    </div>
  );
}
