import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { cookies } from "next/headers";

async function getUserData() {
  try {
    const token = cookies().get("session_token")?.value;
    if (!token) {
      return { name: "Guest", imageUrl: "/default-profile.png" };
    }
    const res = await fetch("url", {
      method: "GET",
      headers: {
        " Authorization": `Bearer ${token}`,
        " Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (res.ok) {
      return {
        name: "Guest",
        imageUrl: "/default-profile.png",
      };
    }
    const data = await res.json();
    return {
      name: data.username || "User X",
      imageUrl: data.profilePictureUrl || "/placeholder-avatar.png",
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { name: "Guest", imageUrl: "/default-profile.png" };
  }
}

export default async function HomePage() {
  const user = await getUserData();
  return (
    <>
      {/* --- Hero Section --- */}
      <section
        className="-mt-24 relative h-[90vh] w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg/bgHero.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-green/100 via-primary-green/80 via-50% to-primary-green/10 z-10" />
        {/* <div className="text-right mr-14 absolute top-8 right-8 z-20 flex flex-col items-end gap-2">
          <p className="text-sm text-black">Selamat Datang!</p>
          <h3 className="font-medium text-black">{user.name}</h3>
        </div> */}

        {/* <Image
          src={user.imageUrl}
          alt="Avatar"
          width={48}
          height={48}
          className="rounded-full border-2 bg-white h-10 w-10 absolute top-8 right-8 z-20"
        /> */}
        <div className=" relative z-20 flex h-full flex-col justify-center p-12 pt-32 md:p-24">
          <h1 className="mb-40 font-bold md:text-5xl">
            Hitung Sumber Emisi dan Dapatkan <br />
            Solusi Terbaik untuk Mengurangi Dampaknya
          </h1>
          <p className="mb-8 text-lg md:text-xl">
            Kendalikan Karbon dan Ubah Masa Depanmu Sekarang
          </p>
          <Link
            href="/hitung"
            className="w-fit rounded-full bg-white px-8 py-3 font-bold text-primary-green transition hover:bg-gray-400"
          >
            Hitung Emisi Karbon
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 items-center gap-12 px-12 py-16 md:grid-cols-2 md:px-24 md:py-24  bg-white">
        <div>
          <Image
            src="/roundedAbt.png"
            alt="Cerobong Asap"
            width={450}
            height={450}
            className="aspect-square rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-primary-green">
            Apa itu Emisi Karbon dan Dampaknya di Kehidupan?
          </h2>
          <p className="leading-relaxed text-black">
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

      <section className="px-12 py-16 md:px-24 md:py-24 bg-primary-green ">
        <h2 className="mb-12 text-center text-4xl font-bold">
          Goals apa yang Bisa Dicapai
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 ml-20">
          <div className="text-center">
            <div className="overflow-hidden rounded-3xl">
              <Image
                src="/cardSolution/forest.jpg"
                alt="Penanaman Pohon"
                width={400}
                height={300}
                className="h-full w-full object-cover transition duration-300 hover:scale-110"
              />
            </div>
            <h2 className="mt-5 text-4xl font-semibold">Zero Net Emmision</h2>
          </div>
          <div className="text-center">
            <div className="overflow-hidden rounded-3xl ">
              <Image
                src="/cardSolution/drink.jpg"
                alt="Zero Plastic"
                width={400}
                height={300}
                className="h-full w-full object-contain  transition duration-300 hover:scale-110"
              />
            </div>
            <h3 className="mt-5 text-4xl font-semibold">Zero Plastic</h3>
          </div>
          <div className="text-center">
            <div className="overflow-hidden rounded-3xl">
              <Image
                src="/cardSolution/electrical.jpg"
                alt="Pengurangan Energi"
                width={400}
                height={300}
                className="h-full w-full object-cover transition duration-300 hover:scale-110"
              />
            </div>
            <h3 className="mt-5  text-4xl font-semibold">Pengurangan Energi</h3>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 items-center gap-12 px-12 py-16 md:grid-cols-2 md:px-24 md:py-24 bg-white">
        <div className="flex flex-col gap-4 ml-20  ">
          <h2 className="text-3xl font-bold text-primary-green">Sertifikasi</h2>
          <p className="leading-relaxed text-xl text-black">
            CarbonTracker menyediakan Sertifikasi Ramah Lingkungan sebagai
            pemberian pengakuan resmi dan apresiasi kepada perusahaan mu. Setiap
            bulan, saat Perusahaanmu berhasil menekan emisi hingga mencapai
            target pengurangan yang telah ditetapkan, sistem akan mencatat
            kemajuan tersebut. Dan Perusahaanmu berhak mendapatkan Sertifikat
            Ramah Lingkungan yang terverifikasi.
          </p>
        </div>
        <div className="ml-48">
          <Image
            src="/certificate.jpg"
            alt="Sertifikat"
            width={500}
            height={350}
            className="rounded-lg object-contain"
          />
        </div>
      </section>

      <section className="flex flex-col items-center justify-center px-12 py-16 text-center md:px-24 md:py-24 bg-primary-green">
        <h2 className="mb-8 max-w-4xl text-4xl font-bold">
          Mulai Kurangi Emisi dan Wujudkan Bisnis Zero Carbon
        </h2>
        <Link
          href="/hitung"
          className="w-fit rounded-full bg-white px-8 py-3 font-bold text-primary-green transition hover:bg-gray-400"
        >
          Hitung Emisi Karbon
        </Link>
      </section>
    </>
  );
}
