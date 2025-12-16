"use client";

import Link from "next/link";
import CartItem from "@/components/CartItem";
import Button from "@/components/Button";
import { useCart } from "@/context/CartContext";

const CartPage = () => {
  const { items, subtotal } = useCart();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="section-heading">Cart</h1>
        <Link href="/paintings" className="button-outline text-xs">
          Continue browsing
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="card-glass rounded-3xl p-8 text-center text-white/70">
          <p>Your cart is empty.</p>
          <Link href="/paintings" className="mt-4 inline-block button-primary">
            View paintings
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem key={item.painting.id} item={item} />
            ))}
          </div>
          <div className="card-glass rounded-3xl p-6">
            <h2 className="font-display text-2xl">Order summary</h2>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-white">Calculated at checkout</span>
              </div>
            </div>
            <div className="mt-6 border-t border-white/10 pt-4">
              <div className="flex justify-between text-lg font-semibold text-sand-200">
                <span>Estimated total</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <Link href="/checkout" className="mt-5 block">
                <Button className="w-full">Proceed to checkout</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
