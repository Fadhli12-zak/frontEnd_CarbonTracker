"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DonutEmissionChart from "@/components/charts/DonutEmissionChart";
import StackedEmissionChart from "@/components/charts/StackedEmissionChart";

export default function EmissionPage() {
  const [data, setData] = useState({
    totalEmissions: [],
    categoricalEmissions: [],
    analisis: "Memuat analisis...",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("token tidak ditemukan, anda akan diarahkan ke login");
        const timer = setTimeout(() => {
          router.push("/login");
        }, 2000);
        setIsLoading(false);
        return () => clearTimeout(timer);
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/emission-results/latest`;

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
          let errorMsg = "Gagal mengambil data emisi.";
          try {
            errorMsg = responseData.message || errorMsg;
          } catch (e) {}
          if (res.status === 401) {
            localStorage.removeItem("authToken");
            errorMsg = "Sesi Anda telah berakhir. Silakan login kembali.";
            setTimeout(() => router.push("/login"), 2000);
          }
          throw new Error(errorMsg);
        }

        const colorMap = {
          "Listrik PLN": "#00BCD4",
          Genset: "#8BC34A",
          LPG: "#FF5722",
          "BBM Solar / Diesel": "#9C27B0",
          "BBM Bensin / Gasolin": "#3F51B5",
          "Transportasi Operasional(Mobil Bensin)": "#E91E63",
          "Transportasi Operasional(Mobil Diesel)": "#F44336",
          "Perjalanan Dinas(Pesawat Domestik)": "#4CAF50",
          "Transportasi Barang": "#FF9800",
          "Air Conditioning(R-134a)": "#009688",
          "Air Conditioning(R-410A)": "#CDDC39",
          "Konsumsi Kertas": "#795548",
          "Air Bersih": "#2196F3",
          "Limbah Padat": "#673AB7",
          "Limbah Cair": "#FFEB3B",
          Energi: "#607D8B",
          Transportasi: "#C2185B",
          Produksi: "#FFA726",
          Limbah: "#2E7D32",
          Pendingin: "#7B1FA2",
          "Tidak ada Emisi": "#9E9E9E",
        };

        if (
          responseData.success &&
          responseData.data &&
          typeof responseData.data === "object" &&
          !Array.isArray(responseData.data)
        ) {
          const apiData = responseData.data;
          const totalEmissionValue = parseFloat(apiData.total_emission) || 0;
          const emissionDetails = apiData.emissioninput?.emissioninputdetail;
          const formattedTotalEmissions = Array.isArray(emissionDetails)
            ? emissionDetails.map((detail) => {
                const sourceName = detail.emissionsource?.name || "Unknown";
                const percentage =
                  totalEmissionValue > 0
                    ? ((parseFloat(detail.emission_value) || 0) /
                        totalEmissionValue) *
                      100
                    : 0;
                return {
                  name: sourceName,
                  percentage: parseFloat(percentage.toFixed(2)),
                  color: colorMap[sourceName] || "#CCCCCC",
                };
              })
            : [];

          const categories = [
            "energi",
            "transportasi",
            "produksi",
            "limbah",
            "pendingin",
          ];
          const formattedCategoricalEmissions = [];
          let categoryId = 1;

          for (const categoryName of categories) {
            const categoryDataArray = Array.isArray(apiData[categoryName])
              ? apiData[categoryName]
              : [];
            const totalCategoryPercentage = categoryDataArray.reduce(
              (sum, item) => sum + (parseFloat(item.percentage) || 0),
              0
            );

            if (totalCategoryPercentage > 0) {
              let displayName =
                categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
              if (displayName === "Produksi")
                displayName = "Produksi & Material";
              if (displayName === "Transportasi")
                displayName = "Transportasi & Logistik";
              if (displayName === "Pendingin") displayName = "Pendingin / AC";

              const explanation =
                categoryDataArray[0]?.analysis ||
                `Total emisi dari kategori ${displayName}.`;

              formattedCategoricalEmissions.push({
                id: categoryId++,
                name: displayName,
                percentage: totalCategoryPercentage,
                color:
                  colorMap[displayName] || colorMap[categoryName] || "#CCCCCC",
                reason: explanation,
              });
            }
          }

          setData({
            totalEmissions: formattedTotalEmissions,
            categoricalEmissions: formattedCategoricalEmissions
              .sort((a, b) => b.percentage - a.percentage)
              .slice(0, 5),
            analisis: apiData.analisis || "Analisis tidak tersedia.",
          });
        } else if (
          responseData.success &&
          (responseData.data === null || Array.isArray(responseData.data))
        ) {
          setData({
            totalEmissions: [],
            categoricalEmissions: [],
            analisis:
              "Data emisi belum diinput untuk bulan ini. Silakan isi data terlebih dahulu.",
          });
        } else {
          throw new Error("Format data emisi dari server tidak sesuai.");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="w-full flex-grow flex items-center justify-center p-8 bg-white text-gray-700 min-h-screen">
        Memuat data emisi...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex-grow bg-white text-red-600 p-8 text-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Error Memuat Data</h1>
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

  const noTotalData = !data.totalEmissions || data.totalEmissions.length === 0;
  const noCategoricalData =
    !data.categoricalEmissions || data.categoricalEmissions.length === 0;

  return (
    <div className="w-full min-h-full">
      <section className="bg-primary-green text-white p-4 md:p-8 lg:px-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
          Total Emisi Bulan Ini
        </h1>
        <div className="mb-4 h-16">
          {noTotalData ? (
            <div className="h-full flex items-center justify-center text-gray-300 text-sm">
              Data total emisi belum tersedia.
            </div>
          ) : (
            <StackedEmissionChart chartData={data.totalEmissions} />
          )}
        </div>
        {!noTotalData && (
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {data.totalEmissions.map(
              (item, index) =>
                item.percentage > 0 && (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="h-3 w-3 sm:h-4 sm:w-4 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="text-xs sm:text-sm">
                      {item.name} ({item.percentage}%)
                    </span>
                  </div>
                )
            )}
          </div>
        )}
      </section>

      <section className="bg-white text-gray-900 p-4 md:p-8 lg:px-12 pt-8 md:pt-12">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary-green">
          Analisis
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm md:text-base">
          {data.analisis}
        </p>
      </section>

      <section className="bg-white text-gray-900 p-4 md:p-8 lg:px-12 pb-12 md:pb-16">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-primary-green">
          Sumber Emisi Per Kategori
        </h2>
        {noCategoricalData ? (
          <div className="text-center text-gray-500">
            Data emisi per kategori belum tersedia.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {data.categoricalEmissions.map(
              (item) =>
                item.percentage > 0 && (
                  <div
                    key={item.id}
                    className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-6"
                  >
                    <div className="flex-shrink-0">
                      <DonutEmissionChart
                        percentage={parseFloat(item.percentage.toFixed(2))}
                        color={item.color}
                      />
                    </div>
                    <div className="w-full md:w-auto md:flex-grow text-center md:text-left">
                      <h4 className="font-bold mb-1 text-gray-800 text-lg">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">{item.reason}</p>
                    </div>
                  </div>
                )
            )}
          </div>
        )}
      </section>
    </div>
  );
}
