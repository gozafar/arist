"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login, me } from "@/lib/api/auth";

const AdminLoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        await me();
        router.replace("/admin/paintings");
      } catch {
        // not authed
      }
    };
    void check();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      router.replace("/admin/paintings");
    } catch (err) {
      setError("Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-12">
      <div className="card-glass rounded-3xl p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">Admin</p>
        <h1 className="section-heading mt-2 text-3xl">Login to manage paintings</h1>
        <p className="mt-3 text-white/70">Use your admin email and password to access uploads and management.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm">
            <span className="mb-2 block text-white">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sand-400/60"
              placeholder="admin@example.com"
              required
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-white">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sand-400/60"
              placeholder="Enter password"
              required
            />
          </label>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button type="submit" className="button-primary w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-white/60">
          <Link href="/" className="hover:text-white">
            ← Back to site
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
