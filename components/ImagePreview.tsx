import Image from "next/image";

const ImagePreview = ({ src, alt }: { src?: string; alt: string }) => {
  if (!src) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 text-sm text-white/60">
        Image preview will appear here
      </div>
    );
  }

  return (
    <div className="relative h-64 overflow-hidden rounded-2xl border border-white/15 bg-black/40">
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
};

export default ImagePreview;
