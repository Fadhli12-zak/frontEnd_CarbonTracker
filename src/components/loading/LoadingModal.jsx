import Image from "next/image";
import React from "react";

function LoadingModal({ isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Sedang diproses!
        </h3>
        <div className="flex justify-center mb-6">
          <Image
            src="/popup/circle.png"
            alt="Loading"
            width={100}
            height={100}
            className="animate-spin"
          />
        </div>
        <p className="text-gray-700 text-lg">Loading</p>
      </div>
    </div>
  );
}

export default LoadingModal;
