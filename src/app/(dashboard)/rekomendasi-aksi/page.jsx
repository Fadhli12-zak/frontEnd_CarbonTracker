import Image from "next/image";

const recommendationsData = [
  {
    id: 1,
    title: "Pengurangan 10% konsumsi listrik dan gas operasional",
    description:
      "Aksi ini bertujuan untuk mencapai pengurangan konsumsi listrik dan gas operasional sebesar 10% dalam 30 hari melalui perubahan kebiasaan dan peningkatan efisiensi infrastruktur, perusahaan dapat secara langsung mengurangi input data kWh perbulan.",
    imageUrl: "/ArticleImage/laptop.jpg",
  },
  {
    id: 2,
    title: "Optimasi Rute Logistik",
    description:
      "Dengan memanfaatkan AI, yang membantu menyusun rute pengiriman dan perjalanan bisnis yang lebih efisien, sehingga kendaraan tidak menempuh jarak yang tidak perlu. Dengan langkah ini, perusahaan berkontribusi langsung dalam pengurangan emisi dari sektor transportasi.",
    imageUrl: "/ArticleImage/kurir.jpg",
  },
  {
    id: 3,
    title: 'Kampanye Internal "Low Carbon Habits"',
    description:
      "Dengan mengedukasi karyawan tentang kebiasaan ramah lingkungan, seperti mematikan perangkat saat tidak digunakan atau membawa botol minum sendiri, perusahaan menciptakan budaya kerja yang mendukung pengurangan emisi secara kolektif.",
    imageUrl: "/ArticleImage/demo.jpg",
  },
  {
    id: 4,
    title: "Penanaman 50 Pohon",
    description:
      "Menanam pohon adalah salah satu cara paling efektif untuk menyerap CO2 dari atmosfer. Aksi ini tidak hanya membantu mengurangi jejak karbon perusahaan, tetapi juga meningkatkan citra hijau perusahaan.",
    imageUrl: "/ArticleImage/Pohon.jpg",
  },
];

export default function RekomendasiAksiPage() {
  return (
    <div className="w-full bg-white text-gray-900">
      <div className="h-24 w-full bg-tertiary-green -mb-10 " />
      <div className="p-20 ">
        <h1 className="text-3xl font-bold mb-8 text-primary-green">
          Rekomendasi Aksi
        </h1>

        <div className="space-y-6">
          {recommendationsData.map((item) => (
            <article
              key={item.id}
              className="
              flex flex-col md:flex-row bg-light-green
              rounded-lg shadow-sm overflow-hidden p-6 
              items-center transition-shadow hover:shadow-md
            "
            >
              <div className="w-full h-56 md:w-1/3 flex-shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="rounded-lg object-cover h-56 min-w-72 "
                />
              </div>

              {/* Kolom Teks */}
              <div className="w-full md:w-2/3 mt-4 md:mt-0 md:pl-6 ">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                  {item.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
