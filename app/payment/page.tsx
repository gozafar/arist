"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { useCart } from "@/context/CartContext";

const PaymentPage = () => {
  const { subtotal, clearCart } = useCart();
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    setSuccess(true);
    clearCart();
  };

  if (success) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center lg:px-6">
        <div className="card-glass mx-auto max-w-2xl rounded-3xl p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sand-500 text-black shadow-card">
            ✓
          </div>
          <h1 className="mt-6 section-heading">Payment confirmed</h1>
          <p className="mt-4 text-white/70">
            Thank you for collecting Lipi's work. We will email you with crating and shipping details.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/paintings" className="button-outline">
              Keep browsing
            </Link>
            <Link href="/" className="button-primary">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6 lg:py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="section-heading">Payment</h1>
        <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/70">Secure mock checkout</span>
      </div>
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="card-glass rounded-3xl p-6">
          <h2 className="font-display text-2xl">Card details</h2>
          <div className="mt-5 space-y-4 text-sm text-white/70">
            <Input label="Name on card" placeholder="Lipi Srivastava" />
            <Input label="Card number" placeholder="4242 4242 4242 4242" />
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Expiry" placeholder="08 / 29" />
              <Input label="CVV" placeholder="123" />
            </div>
            <Input label="Billing zip" placeholder="560001" />
            <Button className="w-full" onClick={handlePay}>
              Pay ${subtotal.toLocaleString()}
            </Button>
          </div>
        </div>
        <div className="card-glass rounded-3xl p-6">
          <h2 className="font-display text-2xl">Order recap</h2>
          <p className="mt-2 text-sm text-white/70">A quick glance before confirming.</p>
          <div className="mt-6 space-y-3 text-sm text-white/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Included</span>
            </div>
            <div className="border-t border-white/10 pt-4 text-lg font-semibold text-sand-200">
              <div className="flex justify-between">
                <span>Total due</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-white/60">
              This is a mock payment UI. No card data is processed. Click pay to see the success screen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, placeholder }: { label: string; placeholder: string }) => (
  <label className="block text-sm">
    <span className="mb-2 block text-white">{label}</span>
    <input
      placeholder={placeholder}
      className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sand-400/60"
    />
  </label>
);

export default PaymentPage;
