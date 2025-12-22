import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black/50 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between lg:px-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Rakhi Vashisht</p>
          <p className="mt-2 text-white/80">Acrylic & oil | Hong Kong</p>
        </div>
        <div className="flex gap-4 text-sm text-white/70">
          <Link href="/about" className="hover:text-white">
            About
          </Link>
          <Link href="/paintings" className="hover:text-white">
            Paintings
          </Link>
          <Link href="/contact" className="hover:text-white">
            Contact
          </Link>
        </div>
        <div className="flex items-center gap-3 text-white/70">
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="hover:text-white">
            Instagram
          </a>
          <span className="text-white/40">•</span>
          <a href="https://dribbble.com" target="_blank" rel="noreferrer" className="hover:text-white">
            Dribbble
          </a>
          <span className="text-white/40">•</span>
          <a href="mailto:hello@artsylipsri.com" className="hover:text-white">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
