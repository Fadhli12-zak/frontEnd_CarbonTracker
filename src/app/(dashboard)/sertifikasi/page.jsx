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
  };

  const errorInfo = {
    title: "Sertifikat Belum Bisa",
    highlight: "Diunduh!",
    image: "/popup/failed.png",
    highlightColor: "text-red-600",
    buttonColor: "bg-red-600",
  };

  const info = status === "success" ? successInfo : errorInfo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h3
          className={`text-2xl font-bold mb-4 ${
            status === "error" ? "text-black" : "text-black"
          }`}
        >
          {info.title}{" "}
          <span className={info.highlightColor}>{info.highlight}</span>
        </h3>
        {/* Gambar */}
        <div className="my-6 flex justify-center">
          <Image
            src={info.image}
            alt={
              status === "success"
                ? "Success illustration"
                : "Error illustration"
            }
            width={250}
            height={150}
            objectFit="contain"
          />
        </div>
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
  // const [downloadError, setDownloadError] = useState('');

  // State untuk modal
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
        // throw new Error( (await response.json()).message || 'Gagal mengunduh sertifikat.');
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
    <div className="w-full relative">
      {" "}
      <section className="bg-primary-green text-white p-8">
        <h1 className="text-3xl font-bold mb-6">History Emisi</h1>
        <h2 className="text-lg font-semibold mb-4">Total Emisi</h2>
        <div className="mb-4">
          <MonthlyEmissionChart monthlyData={historyData} />
        </div>
        <div className="flex justify-center gap-x-6 gap-y-2">
          {legendData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span
                className="h-4 w-4 rounded-sm"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-sm">{item.name}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white text-gray-900 p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-x-8 items-start">
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-2xl font-bold mb-4 text-primary-green">
            Unlock Certificate
          </h2>
          <Image
            src="/certificate.jpg"
            alt="Sertifikat"
            width={400}
            height={280}
            className="rounded-lg shadow-md mb-6 object-contain"
          />
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="rounded-3xl bg-primary-green py-2 px-6 text-lg font-bold text-white hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed w-full md:w-auto"
          >
            {isDownloading ? "Mengunduh..." : "Unduh Sertifikat"}
          </button>
        </div>

        {/* Kolom Kanan */}
        <div className="pt-0 md:pt-12 -ml-60">
          <p className="mb-4 text-gray-700 text-lg">
            <strong className="text-primary-green">
              Sertifikat ini dapat diunduh
            </strong>{" "}
            oleh perusahaan{" "}
            <strong className="text-gray-700">
              yang telah menunjukkan komitmen dan konsistensi
            </strong>{" "}
            dalam pelaporan serta pengelolaan emisi karbon selama satu tahun
            penuh. Untuk memperoleh sertifikat ini, perusahaan perlu memenuhi
            dua syarat utama:
          </p>
          <div className="space-y-5 ">
            <div>
              <p className="font-bold text-lg text-gray-800">
                1. Melaporkan Data Emisi Secara Berkala
              </p>
              <p className="text-lg text-gray-600">
                Perusahaan wajib menginputkan data emisi setiap bulan selama 12
                bulan berturut-turut tanpa jeda. Hal ini menunjukkan komitmen
                terhadap transparansi dan pelacakan emisi secara berkelanjutan.
              </p>
            </div>
            <div>
              <p className="font-bold text-lg text-gray-800">
                2. Menjaga Emisi Tetap Stabil dan Rendah
              </p>
              <p className="text-lg text-gray-600">
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
