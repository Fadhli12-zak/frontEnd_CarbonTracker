// src/app/(dashboard)/layout.jsx
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
async function checkAuth() {
  const token = cookies().get("session_token")?.value;

  // if (!token) {
  //   // Jika TIDAK ADA token, lempar ke halaman login
  //   redirect("/login");
  // }

  try {
    // const res = await fetch('URL_API_USER/me', {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // });
    // if (!res.ok) throw new Error('Token tidak valid');
    // const user = await res.json();
    // return user;

    // Data Mock untuk sementara
    return { name: "User X", imageUrl: "/placeholder-avatar.png" };
  } catch (error) {
    console.error(error);
    redirect("/login");
  }
}

export default async function DashboardLayout({ children }) {
  const user = await checkAuth();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-20 w-full relative">
        <header
          className="absolute z-30 flex items-center gap-4 
            top-6 right-6 "
        >
          <div className="text-right">
            <p className="text-sm text-gray-300">Selamat Datang!</p>
            <h3 className="font-medium text-white">{user.name}</h3>
          </div>
          <Image
            src={user.imageUrl}
            alt="Avatar"
            width={48}
            height={48}
            className="rounded-full border-2 border-white/50"
          />
        </header>

        <div className="flex-grow">{children}</div>
      </main>
    </div>
  );
}
