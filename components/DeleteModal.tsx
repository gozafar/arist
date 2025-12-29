"use client";

import { ReactNode } from "react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel"
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-black/90 border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {title}
            </h3>
            <p className="text-white/70 text-sm">
              {message}
            </p>
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              onClick={onConfirm}
              className="button-primary text-xs bg-red-500 hover:bg-red-600 text-white"
            >
              {confirmText}
            </button>
            <button
              onClick={onClose}
              className="button-outline text-xs"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}