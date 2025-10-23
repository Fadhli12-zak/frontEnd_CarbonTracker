"use client";
import { useState } from "react";
import Image from "next/image";
import DownloadStatusModal from "@/components/popup/DownloadModal";

export default function CertificateDownloadSection() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [modalStatus, setModalStatus] = useState("success");
  const [modalMessage, setModalMessage] = useState("");

  const handleDownload = async () => {
    setIsDownloading(true);
    setShowDownloadModal(false);
    setModalMessage("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setModalStatus("error");
        setModalMessage("Sesi tidak valid. Silakan login kembali.");
        setShowDownloadModal(true);
        return;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificates/download`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Certificate Download API Status:", response.status);

      if (!response.ok) {
        let errorMsg = "Gagal mengunduh sertifikat.";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
          console.error("Download API Error:", errorData);
        } catch (e) {
          console.error("Could not parse error response");
        }
        if (response.status === 403) {
          errorMsg = "Anda belum memenuhi syarat untuk mengunduh sertifikat.";
        }
        setModalStatus("error");
        setModalMessage(errorMsg);
        setShowDownloadModal(true);
        return;
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "Sertifikat-CarbonTracker.pdf";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch?.[1]) filename = filenameMatch[1];
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setModalStatus("success");
      setModalMessage("Sertifikat berhasil diunduh!");
      setShowDownloadModal(true);
    } catch (error) {
      console.error("Download error:", error);
      setModalStatus("error");
      setModalMessage(
        error.message || "Terjadi kesalahan jaringan saat mengunduh."
      );
      setShowDownloadModal(true);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center md:items-start">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary-green">
          Unlock Certificate
        </h2>
        <Image
          src="/certificate.jpg"
          alt="Sertifikat"
          width={0}
          height={0}
          sizes="(max-width: 768px) 80vw, 400px"
          className="rounded-lg shadow-md mb-6 object-contain w-full max-w-[300px] md:max-w-[400px] h-auto"
        />
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="rounded-3xl bg-primary-green py-2 px-6 text-base md:text-lg font-bold text-white hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed w-full max-w-[300px] md:w-auto md:max-w-none"
        >
          {isDownloading ? "Mengunduh..." : "Unduh Sertifikat"}
        </button>
      </div>

      <DownloadStatusModal
        isOpen={showDownloadModal}
        status={modalStatus}
        messageOverride={modalMessage}
        onClose={() => setShowDownloadModal(false)}
      />
    </>
  );
}
