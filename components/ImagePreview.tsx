import Image from 'next/image';

const ImagePreview = ({ src, alt }: { src?: string; alt: string }) => {
  if (!src) {
    return (
      <div className='flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 text-sm text-white/60'>
        Image preview will appear here
      </div>
    );
  }

  return (
    <div className='relative h-96 overflow-hidden rounded-2xl border border-white/15 bg-black/40'>
      <Image
        src={src}
        alt={alt}
        fill
        className='object-cover'
        loading='lazy'
        sizes='(max-width: 768px) 100vw, 50vw'
        quality={75}
        placeholder='blur'
        blurDataURL='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YxZjFmMSIvPjwvc3ZnPg=='
      />
    </div>
  );
};

export default ImagePreview;
