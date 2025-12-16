"use client";

import { useState } from "react";
import Button from "@/components/Button";

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6 lg:py-16">
      <div className="mb-8 space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">Connect</p>
        <h1 className="section-heading">Contact Lipi</h1>
        <p className="max-w-2xl text-white/70">
          For purchases, commissions, or studio visits, leave a note. Lipi responds within one business day.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="card-glass rounded-3xl p-6">
          {submitted ? (
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sand-500 text-black">✓</div>
              <h2 className="font-display text-2xl">Message sent</h2>
              <p className="text-white/70">Thank you for reaching out. Expect a reply soon.</p>
            </div>
          ) : (
            <form
              className="space-y-4 text-sm"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <Input label="Name" placeholder="Your name" required />
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Email" type="email" placeholder="you@example.com" required />
                <Input label="Phone" placeholder="Optional" />
              </div>
              <label className="block text-sm">
                <span className="mb-2 block text-white">Message</span>
                <textarea
                  rows={5}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sand-400/60"
                  placeholder="Tell me about the piece or commission you're interested in"
                  required
                />
              </label>
              <Button type="submit" className="w-full md:w-auto">
                Send message
              </Button>
            </form>
          )}
        </div>

        <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-display text-2xl">Visit or follow</h2>
          <div className="space-y-3 text-white/70">
            <p>
              Bangalore studio visits available by appointment. Weekdays 10am–6pm.
            </p>
            <div className="space-y-2">
              <p className="font-semibold text-white">Social</p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com" className="button-outline text-xs" target="_blank" rel="noreferrer">
                  Instagram
                </a>
                <a href="https://www.behance.net" className="button-outline text-xs" target="_blank" rel="noreferrer">
                  Behance
                </a>
                <a href="mailto:studio@anandnarayan.art" className="button-outline text-xs">
                  Email
                </a>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-white">Studio</p>
              <p className="text-white/60">Indiranagar, Bangalore</p>
              <p className="text-white/60">Call: +91 98765 43210</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, placeholder, type = "text", required = false }: { label: string; placeholder: string; type?: string; required?: boolean }) => (
  <label className="block text-sm">
    <span className="mb-2 block text-white">{label}</span>
    <input
      type={type}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sand-400/60"
    />
  </label>
);

export default ContactPage;
