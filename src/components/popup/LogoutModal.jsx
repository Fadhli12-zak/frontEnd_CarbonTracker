// src/components/common/LogoutConfirmationModal.jsx (or define within Sidebar.jsx)
"use client";

import React from "react";

function LogoutConfirmationModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <h3 className="text-2xl font-semibold text-gray-900 mb-8">
          Keluar dari Akun?
        </h3>

        <div className="flex flex-col gap-4">
          <button
            onClick={onConfirm} 
            className="rounded-full bg-red-500 px-8 py-3 text-white font-bold text-lg transition hover:bg-red-600"
          >
            Keluar
          </button>
          <button
            onClick={onCancel}
            className="rounded-full border border-primary-green px-8 py-3 text-primary-green font-bold text-lg transition hover:bg-green-50"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirmationModal;
