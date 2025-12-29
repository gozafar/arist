import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-white/15 bg-white/70 py-10 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between lg:px-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-black/60">Artistry – Online Painting Gallery</p>
          <p className="mt-2 text-black/80">Curated originals with worldwide shipping</p>
        </div>
        <div className="flex gap-4 text-sm text-black/70">
          <Link href="/about" className="hover:text-sand-700">
            About
          </Link>
          <Link href="/paintings" className="hover:text-sand-700">
            Paintings
          </Link>
          <Link href="/contact" className="hover:text-sand-700">
            Contact
          </Link>
        </div>
        <div className="flex items-center gap-3 text-black/70">
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="hover:text-sand-700">
            Instagram
          </a>
          <span className="text-black/30">•</span>
          <a href="https://www.facebook.com/RakhisArt/" target="_blank" rel="noreferrer" className="hover:text-sand-700">
            Facebook
          </a>
          <span className="text-black/30">•</span>
           <a href="https://www.linkedin.com/in/rakhi-vashisht-b373858/" className="hover:text-sand-700">
            Linkdin
          </a>
          <span className="text-black/30">•</span>

          <a href="mailto:rakhistudio1010@gmail.com" className="hover:text-sand-700">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
