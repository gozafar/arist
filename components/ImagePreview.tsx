import Image from 'next/image';

const ImagePreview = ({ src, alt }: { src?: string; alt: string }) => {
  if (!src) {
    return (
      <div className='flex h-48 items-center justify-center rounded-2xl border border-dashed border-black/15 bg-black/5 text-sm text-black/60'>
        Image preview will appear here
      </div>
    );
  }

  return (
    <div className='flex justify-center overflow-auto rounded-2xl border border-black/15 bg-black/5 p-3'>
      <Image
        src={src}
        alt={alt}
        width={800} // intrinsic width (can be dynamic)
        height={800} // intrinsic height (can be dynamic)
        className='h-auto w-auto max-w-full rounded-xl'
        loading='lazy'
        quality={75}
      />
    </div>
  );
};

export default ImagePreview;
