"use client";

import { useState } from "react";
import Image from "next/image";
import MonthlyEmissionChart from "@/components/charts/MonthlyEmissionChart";

const historyData = {
  Jan: { rendah: 15, sedang: 40, tinggi: 45 },
  Feb: { rendah: 10, sedang: 30, tinggi: 35 },
  Mar: { rendah: 5, sedang: 45, tinggi: 25 },
  Apr: {},
  May: { rendah: 20, sedang: 40, tinggi: 0 },
  Jun: { rendah: 18, sedang: 35, tinggi: 0 },
  Jul: { rendah: 12, sedang: 42, tinggi: 0 },
  Aug: { rendah: 15, sedang: 45, tinggi: 0 },
  Sep: { rendah: 10, sedang: 38, tinggi: 0 },
  Oct: { rendah: 14, sedang: 30, tinggi: 0 },
  Nov: { rendah: 11, sedang: 41, tinggi: 0 },
  Dec: { rendah: 8, sedang: 28, tinggi: 18 },
};

const legendData = [
  { name: "Tinggi (46-100%)", color: "#FF1493" },
  { name: "Sedang (21-45%)", color: "#FFA500" },
  { name: "Rendah (0-20%)", color: "#ADFF2F" },
];

function DownloadStatusModal({ isOpen, status, onClose }) {
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
    message: "Silakan coba lagi nanti atau hubungi support.",
  };

  const info = status === "success" ? successInfo : errorInfo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <h3 className={`text-2xl font-bold mb-4 text-black`}>
          {info.title}
          <span className={info.highlightColor}>{info.highlight}</span>
        </h3>
        <div className="my-6 flex justify-center">
          <Image
            src={info.image}
            alt={
              status === "success"
                ? "Success illustration"
                : "Error illustration"
            }
            width={200}
            height={150}
            objectFit="contain"
          />
        </div>
        <p className="text-gray-700 text-base mb-6">{info.message}</p>
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

export default function SertifikasiPage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [modalStatus, setModalStatus] = useState("success");

  const handleDownload = async () => {
    setIsDownloading(true);
    setShowDownloadModal(false);
    try {
      const response = await fetch("/api/certificate/download", {
        method: "GET",
      });

      if (!response.ok) {
        setModalStatus("error");
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
      setShowDownloadModal(true);
    } catch (error) {
      console.error("Download error:", error);
      setModalStatus("error");
      setShowDownloadModal(true);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full flex-grow">
      <section className="bg-primary-green text-white p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
          History Emisi
        </h1>
        <h2 className="text-base md:text-lg font-semibold mb-4">Total Emisi</h2>
        <div className="mb-4">
          <MonthlyEmissionChart monthlyData={historyData} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 justify-center text-center sm:text-left">
          {legendData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-center sm:justify-start gap-2"
            >
              <span
                className="h-3 w-3 sm:h-4 sm:w-4 rounded-sm flex-shrink-0"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-xs sm:text-sm">{item.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white text-gray-900 p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-x-6 items-start">
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

        <div className="pt-0 md:pt-10 grid ">
          <p className="mb-4 text-gray-700 text-sm md:text-lg ">
            <strong className="text-primary-green">
              Sertifikat ini dapat diunduh
            </strong>
            oleh perusahaan
            <strong className="text-gray-700">
              yang telah menunjukkan komitmen dan konsistensi
            </strong>
            dalam pelaporan serta pengelolaan emisi karbon selama satu tahun
            penuh. Untuk memperoleh sertifikat ini, perusahaan perlu memenuhi
            dua syarat utama:
          </p>
          <div className="space-y-4 md:space-y-5 ">
            <div>
              <p className="font-bold text-base md:text-lg text-gray-800">
                1. Melaporkan Data Emisi Secara Berkala
              </p>
              <p className="text-sm md:text-lg text-gray-600">
                Perusahaan wajib menginputkan data emisi setiap bulan selama 12
                bulan berturut-turut tanpa jeda. Hal ini menunjukkan komitmen
                terhadap transparansi dan pelacakan emisi secara berkelanjutan.
              </p>
            </div>
            <div>
              <p className="font-bold text-base md:text-lg text-gray-800">
                2. Menjaga Emisi Tetap Stabil dan Rendah
              </p>
              <p className="text-sm md:text-lg text-gray-600">
                Selama periode pelaporan, total emisi perusahaan harus berada
                dalam rentang yang stabil dan tergolong sedang hingga rendah.
                Artinya, tidak terjadi lonjakan emisi yang signifikan, dan
                perusahaan mampu menjaga operasional tetap efisien serta ramah
                lingkungan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <DownloadStatusModal
        isOpen={showDownloadModal}
        status={modalStatus}
        onClose={() => setShowDownloadModal(false)}
      />
    </div>
  );
}
