'use client';

import { useEffect, PropsWithChildren } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

type PhotoPreviewProps = {
  galleryId?: string;
};

export default function PhotoPreview({
  galleryId = 'photoswipe-gallery',
  children,
}: PropsWithChildren<PhotoPreviewProps>) {
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: `#${galleryId}`,
      children: 'a',
      pswpModule: () => import('photoswipe'),
    });

    lightbox.init();
    return () => lightbox.destroy();
  }, [galleryId]);

  return <div id={galleryId}>{children}</div>;
}
