import DonutEmissionChart from "@/components/charts/DonutEmisChart";
import StackedEmissionChart from "@/components/charts/StackedEmissionChart";

async function getEmissionData() {
  try {
    // const res = await fetch('URL', {
    //   cache: 'no-store',
    //   headers: {
    //     // 'Authorization': `Bearer ${token}`
    //   }
    // });

    // if (!res.ok) {
    //   throw new Error('Gagal mengambil data emisi');
    // }
    // const data = await res.json();
    // return data;

    // --- Data MOCK (Pengganti API) ---
    const mockData = {
      totalEmissions: [
        { name: "Energi", percentage: 40, color: "#00FFB9" }, // ijau
        { name: "Limbah", percentage: 5, color: "#A1FF00" }, // ungu
        { name: "Produksi & Material", percentage: 10, color: "#FFAE00" }, // iren
        { name: "Transportasi & Logistik", percentage: 30, color: "#FF0088" }, // pink
        { name: "Tidak ada Emisi", percentage: 15, color: "#BDC3C7" }, // abu-abu
      ],
      categoricalEmissions: [
        {
          id: 1,
          name: "Energi",
          percentage: 40,
          color: "#00FFB9",
          source: "Pembakaran bahan bakar untuk menghasilkan energi.",
          reason: "Penggunaan energi yang besar untuk operasional perusahaan.",
        },
        {
          id: 2,
          name: "Produksi & Material",
          percentage: 10,
          color: "#F39C12",
          source: "Proses produksi dan bahan baku yang menghasilkan emisi.",
          reason:
            "Penggunaan material tak ramah lingkungan dan proses yang boros energi.",
        },
        {
          id: 3,
          name: "Transportasi & Logistik",
          percentage: 30,
          color: "#FF0088",
          source:
            "Pembakaran bahan bakar kendaraan untuk transportasi orang dan barang.",
          reason: "Pergerakan orang dan barang terkait operasional perusahaan.",
        },
        {
          id: 4,
          name: "Limbah",
          percentage: 5,
          color: "#A1FF00",
          source:
            "Pembakaran atau penguburan limbah yang menghasilkan gas rumah kaca.",
          reason: "Pengelolaan limbah yang belum optimal.",
        },
      ],
    };
    return mockData;
  } catch (error) {
    console.error(error);
    return { totalEmissions: [], categoricalEmissions: [] };
  }
}
export default async function EmissionPage() {
  const data = await getEmissionData();

  return (
    <div className="w-full bg-white text-white ">
      <section className="bg-tertiary-green p-8 pt-14 mb-12 pb-20 text-white">
        <h1 className="text-3xl font-bold mb-5 ml-9 mt-10 ">
          Total Emisi Bulan Ini
        </h1>
        <div className="mb-4">
          <StackedEmissionChart chartData={data.totalEmissions} />
        </div>

        <div className="grid grid-cols-1 gap-y-2 md:w-fit ml-9 md:grid-rows-2 md:grid-flow-col md:gap-x-6 md:gap-y-2">
          {data.totalEmissions.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span
                className="h-4 w-4 rounded-sm"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-sm">
                {item.name} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-6 lg:mx-16">
        <h2 className="text-2xl font-bold mb-4 text-primary-green">Analisis</h2>
        <p className="text-gray-700 leading-relaxed">
          Berdasarkan Data Input, bulan ini emisi terbesar berasal dari kategori
          Energi dengan kontribusi 40% dari total emisi yang ada (30% dari total
          keseluruhan). Hal ini menunjukkan bahwa penggunaan energi merupakan
          sumber emisi yang signifikan. Transportasi dan Logistik berada di
          posisi kedua dengan kontribusi 20% dari total emisi yang ada (15% dari
          total keseluruhan). Produksi dan Material serta Limbah juga
          berkontribusi pada emisi, namun dengan proporsi yang lebih kecil.
          Sebanyak 25% dari total emisi tidak terklasifikasi atau kosong,
          sehingga perlu dilakukan analisis lebih lanjut untuk memahami sumber
          emisi tersebut.
        </p>
      </section>

      <section className="ml-16 mt-8 mr-16 pb-20 ">
        <h2 className="text-2xl font-bold mb-6 text-primary-green">
          Sumber Emisi Per Kategori
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 ">
          {data.categoricalEmissions.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-6"
            >
              <div className="flex-shrink-0">
                <DonutEmissionChart
                  percentage={item.percentage}
                  color={item.color}
                />
              </div>
              <div className="w-full md:w-auto md:flex-grow">
                <h4 className="font-bold mb-1 text-gray-500">Sumber emisi:</h4>
                <p className="text-sm text-gray-400 mb-3">{item.source}</p>
                <h4 className="font-bold mb-1 text-gray-500">Alasan:</h4>
                <p className="text-sm text-gray-400">{item.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
