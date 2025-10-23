"use client";
import Image from "next/image";

function DownloadStatusModal({ isOpen, status, messageOverride, onClose }) {
  if (!isOpen) return null;

  const successInfo = {
    title: "Sertifikat Berhasil",
    highlight: "Diunduh!",
    image: "/popup/success.png",
    highlightColor: "text-green-600",
    buttonColor: "bg-green-600",
    message: "File tersimpan di perangkat Anda.",
  };
  const errorInfo = {
    title: "Sertifikat Belum Bisa",
    highlight: "Diunduh!",
    image: "/popup/failed.png",
    highlightColor: "text-red-600",
    buttonColor: "bg-red-600",
    message: "Silakan coba lagi nanti.",
  };
  const info = status === "success" ? successInfo : errorInfo;
  const displayMessage = messageOverride || info.message;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <h3 className={`text-2xl font-bold mb-4 text-black`}>
          {info.title}{" "}
          <span className={info.highlightColor}>{info.highlight}</span>
        </h3>
        <div className="my-6 flex justify-center">
          <Image
            src={info.image}
            alt={status === "success" ? "Success" : "Error"}
            width={200}
            height={150}
            objectFit="contain"
            priority
          />
        </div>
        <p className="text-gray-700 text-base mb-6">{displayMessage}</p>
        <button
          onClick={onClose}
          className={`rounded-full ${info.buttonColor} px-8 py-2 text-white font-semibold hover:opacity-90`}
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default DownloadStatusModal;
