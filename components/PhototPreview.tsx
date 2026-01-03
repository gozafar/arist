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

      // ✅ Correct behavior
      initialZoomLevel: 'fit', // fit screen, preserve ratio
      secondaryZoomLevel: 1, // click → original size (1:1)
      maxZoomLevel: 3, // limit zoom
      wheelToZoom: true,
      mainClass: 'pswp-with-perma-preloader',
      showHideAnimationType: 'zoom',
      paddingFn: (viewportSize, itemData, index) => {
        return {
          // check based on slide index
          top: index === 0 ? 100 : 0,

          // check based on viewport size
          bottom: viewportSize.x < 600 ? 0 : 200,

          // check based on image size
          left: 0,

          right: 0,
        };
      },
    });

    lightbox.init();
    return () => lightbox.destroy();
  }, [galleryId]);

  return <div id={galleryId}>{children}</div>;
}
