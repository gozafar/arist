"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STORAGE_KEY = "admin-auth";
const ADMIN_CODE = "artist"; // simple client-side check; adjust as needed

const AdminLoginPage = () => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const alreadyAuthed = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "true";
    if (alreadyAuthed) {
      router.replace("/admin/paintings");
    }
  }, [router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (code.trim().toLowerCase() !== ADMIN_CODE) {
      setError("Invalid admin code. Try again.");
      return;
    }
    localStorage.setItem(STORAGE_KEY, "true");
    router.replace("/admin/paintings");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-12">
      <div className="card-glass rounded-3xl p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">Admin</p>
        <h1 className="section-heading mt-2 text-3xl">Login to manage paintings</h1>
        <p className="mt-3 text-white/70">Use the admin code to access uploads and management.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm">
            <span className="mb-2 block text-white">Admin code</span>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sand-400/60"
              placeholder="Enter admin code"
              required
            />
          </label>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button type="submit" className="button-primary w-full">
            Login
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-white/60">
          <Link href="/" className="hover:text-white">
            ← Back to site
          </Link>
          <span className="text-xs text-white/50">Demo code: {ADMIN_CODE}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
