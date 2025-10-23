import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

async function checkAuth() {
  const token = cookies().get("session_token")?.value;
  // if (!token) {
  //   redirect("/login");
  // }
  try {
    return { name: "User X", imageUrl: "/placeholder-avatar.png" };
  } catch (error) {
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
            top-6 right-6 sm:mb-20 lg:gap-6 bg-gradient-to-r from-green-900 to-transparent rounded-3xl p-2"
        >
          <div className="text-right">
            <p className="text-sm text-gray-200">Selamat Datang!</p>
            <h3 className="font-medium text-gray-200">{user.name}</h3>
          </div>
          <Link href="/profile">
            <Image
              src={"/companyPicture.png"}
              alt="Avatar"
              width={48}
              height={48}
              className="rounded-full border-2 border-white/50"
            />
          </Link>
        </header>

        <div className="flex-grow">{children}</div>
      </main>
    </div>
  );
}
