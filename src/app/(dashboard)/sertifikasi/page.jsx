"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MonthlyEmissionChart from "@/components/charts/MonthlyEmissionChart";
import LoadingModal from "@/components/loading/LoadingModal";

function DownloadStatusModal({ isOpen, status, onClose, messageOverride }) {
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

const legendData = [
  { name: "Tinggi (46-100%)", color: "#FF1493" },
  { name: "Sedang (21-45%)", color: "#FFA500" },
  { name: "Rendah (0-20%)", color: "#ADFF2F" },
];

export default function SertifikasiPage() {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [modalStatus, setModalStatus] = useState("success");
  const [modalMessage, setModalMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function fetchHistoryData() {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Token tidak ditemukan. Mengarahkan ke login...");
        setTimeout(() => router.push("/login"), 2000);
        setIsLoading(false);
        return;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/emission-results/history`;
      console.log(`Fetching history data from: ${apiUrl}`);

      try {
        const res = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });
        const responseData = await res.json();

        if (!res.ok) {
          let errorMsg =
            responseData.message || "Gagal mengambil data histori emisi.";
          if (res.status === 401 || res.status === 403) {
            errorMsg = "Sesi tidak valid. Mengarahkan ke login...";
            localStorage.removeItem("authToken");
            setTimeout(() => router.push("/login"), 2000);
          }
          throw new Error(errorMsg);
        }

        if (
          responseData.success &&
          responseData.data &&
          Array.isArray(responseData.data.history)
        ) {
          setHistoryData(responseData.data.history);
        } else {
          console.warn(
            "History API response structure might be incorrect:",
            responseData
          );
          setHistoryData([]);
        }
      } catch (err) {
        console.error("Error fetching history data:", err);
        setError(err.message || "Terjadi kesalahan.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistoryData();
  }, [router]);

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
        setIsDownloading(false);
        return;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificates/download`;
      console.log("Mencoba download dari:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Certificate Download API Status:", response.status);

      if (!response.ok) {
        let errorMsg = "Gagal mengunduh sertifikat.";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
          if (response.status === 403) {
            errorMsg = "Anda belum memenuhi syarat untuk mengunduh sertifikat.";
          }
        } catch (e) {}
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
      setModalMessage(error.message || "Terjadi kesalahan jaringan.");
      setShowDownloadModal(true);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex-grow flex items-center justify-center p-8 bg-white text-gray-700 min-h-screen">
        Memuat data histori...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex-grow bg-white text-red-600 p-8 text-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Error Memuat Histori</h1>
        <p>{error}</p>
        {!error.includes("Token") && (
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-primary-green text-white px-4 py-2 rounded hover:opacity-90"
          >
            Coba Lagi
          </button>
        )}
      </div>
    );
  }

  const noHistoryData = !historyData || historyData.length === 0;

  return (
    <div className="w-full min-h-full">
      <section className="bg-primary-green text-white p-4 md:p-8 lg:px-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
          History Emisi
        </h1>
        <h2 className="text-base md:text-lg font-semibold mb-4">Total Emisi</h2>
        <div className="mb-4 h-64 w-full">
          <MonthlyEmissionChart
            monthlyData={noHistoryData ? [] : historyData}
          />
        </div>
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-2">
          {legendData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span
                className="h-3 w-3 sm:h-4 sm:w-4 rounded-sm flex-shrink-0"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-xs sm:text-sm">{item.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section
        className="
         bg-white text-gray-900 p-4 md:p-8 lg:px-12
         grid grid-cols-1 md:grid-cols-5 gap-y-8 md:gap-x-8 items-start
         pb-12 md:pb-16
        "
      >
        <div className="flex flex-col items-center md:items-start md:col-span-2">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary-green">
            Unlock Certificate
          </h2>
          <Image
            src="/certificate.jpg"
            alt="Sertifikat"
            width={0}
            height={0}
            sizes="(max-width: 768px) 80vw, 400px"
            className="rounded-lg shadow-md mb-6 object-contain w-full max-w-[300px] md:max-w-full h-auto"
          />
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="rounded-3xl bg-primary-green py-2 px-6 text-base md:text-lg font-bold text-white hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed w-full max-w-[300px] md:w-auto md:max-w-none"
          >
            {isDownloading ? "Mengunduh..." : "Unduh Sertifikat"}
          </button>
        </div>

        <div className="pt-0 md:pt-10 md:col-span-3">
          <p className="mb-4 text-gray-700 text-sm md:text-lg">
            <strong className="text-primary-green">
              Sertifikat ini dapat diunduh
            </strong>{" "}
            oleh perusahaan yang telah menunjukkan komitmen dan konsistensi
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
        messageOverride={modalMessage}
        onClose={() => setShowDownloadModal(false)}
      />
      <LoadingModal isOpen={isDownloading} />
    </div>
  );
}
