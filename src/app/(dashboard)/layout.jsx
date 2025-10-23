"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

async function getUserDataClient(token) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`;

  console.log(`Fetching user data dari: ${apiUrl}`);
  try {
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log("User API Status:", res.status);
    if (!res.ok) {
      throw new Error("Token tidak valid atau expired");
    }

    const responseData = await res.json();
    console.log("User API Data:", responseData);

    if (responseData.success && responseData.data) {
      return {
        name: responseData.data.name || "User",
        imageUrl: "/companyPicture.png",
      };
    } else {
      throw new Error("Format data pengguna dari server tidak sesuai.");
    }
  } catch (error) {
    console.error("Error di getUserDataClient:", error);
    throw error;
  }
}

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState({
    name: "Memuat...",
    imageUrl: "/companyPicture.png",
  });
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const tokenLocal = localStorage.getItem("authToken");
    const tokenCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    const token = tokenLocal || tokenCookie;

    if (!token) {
      console.log(
        "Tidak ada authToken di localStorage maupun cookie, redirect ke login."
      );
      router.push("/login");
      return;
    }

    if (!tokenLocal && tokenCookie) {
      localStorage.setItem("authToken", tokenCookie);
    }

    async function loadUser() {
      try {
        const userData = await getUserDataClient(token);
        setUser(userData);
        setIsLoadingUser(false);
      } catch (error) {
        console.error("Gagal load user data di layout:", error);
        localStorage.removeItem("authToken");
        document.cookie = "authToken=; Max-Age=0; path=/;";
        router.push("/login");
      }
    }

    loadUser();
  }, [router]);
  if (isLoadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary-green text-white">
        Memverifikasi sesi...
      </div>
    );
  }

  const showHeader = pathname !== "/profile";

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-20 w-full relative">
        {showHeader && (
          <header
            className="absolute z-30 flex items-center gap-4 
              top-6 right-6 lg:gap-6 bg-gradient-to-r from-green-900/50 to-transparent rounded-3xl p-2"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm text-gray-200">Selamat Datang!</p>
              <h3 className="font-medium text-gray-100">{user.name}</h3>
            </div>
            <Link href="/profile">
              <Image
                src={user.imageUrl}
                alt="Avatar"
                width={48}
                height={48}
                className="rounded-full border-2 border-white/50"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-avatar.png";
                }}
                priority
              />
            </Link>
          </header>
        )}

        {/* Konten halaman */}
        <div className="flex-grow bg-white">{children}</div>
      </main>
    </div>
  );
}
