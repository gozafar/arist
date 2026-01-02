"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      await logout();
      
      // Redirect to login page
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log out");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card-glass rounded-3xl p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold text-white mb-4">
          Confirm Logout
        </h2>
        
        <p className="text-white/70 mb-6">
          Are you sure you want to log out? You&apos;ll need to sign in again to access the admin panel.
        </p>

        {error && (
          <p className="text-sm text-red-300 mb-4">{error}</p>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 button-outline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}