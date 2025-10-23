"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoutConfirmationModal from "./popup/LogoutModal";
import { usePathname, useRouter } from "next/navigation";
import LoadingModal from "./loading/LoadingModal";

function SidebarDrawer({ isOpen, onClose }) {
  const pathname = usePathname();

  const getDrawerLinkClass = (path) => {
    const baseClass =
      "block p-3 rounded-lg hover:bg-green-600/30 transition-colors duration-200";
    if (pathname === path) {
      return `${baseClass} bg-green-600/30 text-white font-semibold`;
    }
    return `${baseClass} text-gray-300 hover:text-white`;
  };

  return (
    <div
      className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed left-20 top-0 h-screen w-60 bg-secondary-green p-4 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 pb-4 flex-shrink-0">
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <Image
              src={"/icons/backArrow.png"}
              width={28}
              height={28}
              alt="Close Menu"
            />{" "}
          </button>
          <h2 className="text-xl font-semibold text-white">Dashboard</h2>
        </div>

        <div className="border-b border-gray-600 mb-6 flex-shrink-0"></div>
        <nav className="flex flex-col gap-2 overflow-y-auto mt-14">
          <Link href="/" className={getDrawerLinkClass("/")}>
            Home
          </Link>
          <Link
            href="/input-emisi"
            className={getDrawerLinkClass("/input-emisi")}
          >
            Input Data Emisi
          </Link>
          <Link
            href="/rekomendasi-aksi"
            className={getDrawerLinkClass("/rekomendasi-aksi")}
          >
            Rekomendasi Aksi
          </Link>
          <Link
            href="/sertifikasi"
            className={getDrawerLinkClass("/sertifikasi")}
          >
            Sertifikasi
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [isLogOut, setIsLogOut] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setShowLogoutModal(false);
    setIsLogOut(true);
    setTimeout(() => {
      router.push("/login");
    }, 500);
  };
  const getIconLinkClass = (path, isToogleIcon = false) => {
    const baseClass =
      "hover:bg-green-600/20 rounded-lg p-1 transition-colors duration-200";
    const activeClass = "bg-green-600/20";
    if (isToogleIcon && path === "/" && pathname === "/") {
      return baseClass;
    }
    if (path === "/" && pathname === "/") {
      return `${baseClass} ${activeClass}`;
    } else if (path !== "/" && pathname.startsWith(path)) {
      return `${baseClass} ${activeClass}`;
    }

    return baseClass;
  };

  return (
    <>
      <aside className="fixed left-0 top-0 flex h-screen w-20 flex-col items-center justify-between bg-secondary-green p-4 z-30">
        <div className="flex flex-col items-center gap-6 ">
          <Link href="/">
            <Image src="/Logo.png" alt="Logo" width={40} height={40} />
          </Link>
          <Image
            src="/icons/Rectangle.png"
            width={50}
            height={1}
            alt="Separator"
          />
          <nav className="flex flex-col gap-6 ">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleDrawer();
                getIconLinkClass(true);
              }}
              aria-label="Home and Dashboard Menu"
              className="pl-1"
            >
              <Image
                src="/icons/dashboard.png"
                width={21}
                height={21}
                alt="Dashboard"
              />
            </button>
            <Link href="/" className={getIconLinkClass("/")}>
              <Image
                src="/icons/home.png"
                width={21}
                height={21}
                alt="Input Emisi"
              />
            </Link>
            <Link
              href="/input-emisi"
              className={getIconLinkClass("/input-emisi")}
            >
              <Image
                src="/icons/add.png"
                width={21}
                height={21}
                alt="Input Emisi"
              />
            </Link>
            <Link
              href="/rekomendasi-aksi"
              className={getIconLinkClass("/rekomendasi-aksi")}
            >
              <Image
                src="/icons/Goals.png"
                width={21}
                height={21}
                alt="rekomendasi-aksi"
              />
            </Link>
            <Link
              href="/sertifikasi"
              className={getIconLinkClass("/sertifikasi")}
            >
              <Image
                src="/icons/Sertif.png"
                width={21}
                height={21}
                alt="Sertifikasi"
              />
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <Image
            src="/icons/Rectangle.png"
            width={50}
            height={1}
            alt="Separator"
          />
          <Link href="/profile" className={getIconLinkClass("/profile")}>
            <Image
              src="/icons/Settings.png"
              width={21}
              height={21}
              alt="Settings"
            />
          </Link>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="hover:bg-green-600/20 rounded-lg p-1"
            aria-label="Logout"
          >
            <Image
              src="/icons/Logout.png"
              width={21}
              height={21}
              alt="Logout"
            />
          </button>
        </div>
      </aside>

      <SidebarDrawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
      <LoadingModal isOpen={isLogOut} />
    </>
  );
}
