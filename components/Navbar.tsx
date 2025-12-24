"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/paintings", label: "Paintings" },
  { href: "/contact", label: "Contact" },
  { href: "/admin/paintings", label: "Admin" }
];

const Navbar = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);

  const linkClass = (href: string) =>
    `relative px-3 py-2 text-sm font-medium transition ${
      pathname === href ? "text-sand-200" : "text-white/80 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/40 border-b border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sand-500 to-sand-700 shadow-card" />
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">Rakhi Studio</p>
            <p className="font-display text-xl">Rakhi Vashisht</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              {item.label}
            </Link>
          ))}
          <Link
            href="/cart"
            className="relative rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:border-white/30"
          >
            Cart
            <span className="ml-2 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-sand-500 px-2 text-xs font-semibold text-black shadow-card">
              {totalItems}
            </span>
          </Link>
        </nav>

        <button
          className="md:hidden rounded-full border border-white/20 p-2 text-white"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <div className="flex flex-col gap-1">
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
          </div>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/70">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-4 gap-3 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={linkClass(item.href)}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {/* <Link
              href="/cart"
              className="flex items-center justify-between rounded-xl border border-white/15 px-4 py-3 text-white"
              onClick={() => setOpen(false)}
            >
              <span>Cart</span>
              <span className="ml-2 inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-full bg-sand-500 px-2 text-xs font-semibold text-black shadow-card">
                {totalItems}
              </span>
            </Link> */}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
