import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section
        className="relative w-full bg-cover bg-center bg-no-repeat pt-24 md:pt-0 md:-mt-24 md:h-screen"
        style={{ backgroundImage: "url('/bg/bgHero.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-green/100 via-primary-green/80 via-50% to-primary-green/10 z-10" />

        <div className="relative z-20 flex h-full flex-col justify-center p-6 sm:p-12 md:p-20 lg:p-24 pb-16 sm:pb-20 md:pb-24 lg:pb-32">
          <h1 className="mb-8 sm:mb-12 md:mb-20 lg:mb-40 font-bold text-3xl sm:text-4xl md:text-5xl text-white">
            Hitung Sumber Emisi dan Dapatkan <br className="hidden sm:block" />
            Solusi Terbaik untuk Mengurangi Dampaknya
          </h1>
          <p className="mb-6 md:mb-8 text-base sm:text-lg md:text-xl text-gray-200">
            Kendalikan Karbon dan Ubah Masa Depanmu Sekarang
          </p>
          <Link
            href="/input-emisi"
            className="w-fit rounded-full bg-white px-6 py-2 md:px-8 md:py-3 text-sm md:text-base font-bold text-primary-green transition hover:bg-gray-200"
          >
            Hitung Emisi Karbon
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12 px-6 sm:px-12 md:px-24 py-12 md:py-24 bg-white text-black">
        {/* Gambar */}
        <div className="flex justify-center order-1">
          <Image
            src="/roundedAbt.png"
            alt="Cerobong Asap Ilustrasi"
            width={300}
            height={300}
            className="aspect-square rounded-full object-cover md:w-[450px] md:h-[450px]"
          />
        </div>
        {/* Teks */}
        <div className="flex flex-col gap-4 text-center md:text-left order-2">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-green">
            Apa itu Emisi Karbon dan Dampaknya di Kehidupan?
          </h2>
          <p className="leading-relaxed text-base md:text-lg">
            Emisi karbon adalah gas karbon dioksida (CO₂) yang dilepaskan ke
            atmosfer, terutama dari aktivitas manusia seperti penggunaan
            kendaraan bermotor, pembakaran bahan bakar fosil, dan proses
            industri. Gas ini berperan besar dalam mempercepat pemanasan global
            dan perubahan iklim, yang berdampak langsung pada kehidupan
            sehari-hari, mulai dari cuaca ekstrem, banjir, hingga gangguan
            kesehatan akibat polusi udara. Jika tidak dikendalikan, maka emisi
            karbon dapat merusak lingkungan dan kualitas hidup generasi
            mendatang.
          </p>
        </div>
      </section>

      <section className="px-6 sm:px-12 py-12 md:px-20 md:py-24 bg-primary-green text-white">
        <h2 className="mb-10 md:mb-12 text-center text-3xl md:text-4xl font-bold">
          Goals apa yang Bisa Dicapai
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="overflow-hidden rounded-3xl">
              <Image
                src="/cardSolution/forest.jpg"
                alt="Hutan Hijau"
                width={400}
                height={300}
                className="h-full w-full object-cover transition duration-300 hover:scale-110"
              />
            </div>
            <h3 className="mt-4 md:mt-5 text-2xl font-semibold">
              Zero Net Emmision
            </h3>
          </div>
          <div className="text-center">
            <div className="overflow-hidden rounded-3xl">
              <Image
                src="/cardSolution/drink.jpg"
                alt="Minuman dalam botol kaca"
                width={400}
                height={300}
                className="h-full w-full object-cover transition duration-300 hover:scale-110"
              />
            </div>
            <h3 className="mt-4 md:mt-5 text-2xl font-semibold">
              Zero Plastic
            </h3>
          </div>
          <div className="text-center">
            <div className="overflow-hidden rounded-3xl">
              <Image
                src="/cardSolution/electrical.jpg"
                alt="Panel Listrik"
                width={400}
                height={300}
                className="h-full w-full object-cover transition duration-300 hover:scale-110"
              />
            </div>
            <h3 className="mt-4 md:mt-5 text-2xl font-semibold">
              Pengurangan Energi
            </h3>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-16 px-6 sm:px-12 md:px-24 py-16 md:py-28 bg-white text-black lg:px-24">
        <div className="flex flex-col gap-4 text-center md:text-left order-2 md:order-1">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-green">
            Sertifikasi
          </h2>
          <p className="leading-relaxed text-base md:text-lg">
            CarbonTracker menyediakan Sertifikasi Ramah Lingkungan sebagai
            pemberian pengakuan resmi dan apresiasi kepada perusahaan mu. Setiap
            bulan, saat Perusahaanmu berhasil menekan emisi hingga mencapai
            target pengurangan yang telah ditetapkan, sistem akan mencatat
            kemajuan tersebut. Dan Perusahaanmu berhak mendapatkan Sertifikat
            Ramah Lingkungan yang terverifikasi.
          </p>
        </div>

        <div className="flex justify-center md:justify-end order-1 md:order-2">
          <Image
            src="/certificate.jpg"
            alt="Contoh Sertifikat"
            width={0}
            height={0}
            sizes="100vw"
            className="rounded-lg object-contain w-60 h-auto sm:w-72 md:w-80 lg:w-96"
          />
        </div>
      </section>

      <section className="flex flex-col items-center justify-center px-6 sm:px-12 py-12 text-center md:px-24 md:py-24 bg-primary-green text-white">
        <h2 className="mb-8 max-w-2xl text-3xl md:text-4xl font-bold">
          Mulai Kurangi Emisi dan Wujudkan Bisnis Zero Carbon
        </h2>
        <Link
          href="/input-emisi"
          className="w-fit rounded-full bg-white px-6 py-2 md:px-8 md:py-3 text-sm md:text-base font-bold text-primary-green transition hover:bg-gray-200"
        >
          Hitung Emisi Karbon
        </Link>
      </section>
    </>
  );
}
