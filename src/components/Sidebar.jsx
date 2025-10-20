"use client";

import Link from "next/link";
import Image from "next/image";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 flex h-screen w-20 flex-col items-center justify-between bg-secondary-green p-4 z-30">
      <div className="flex flex-col items-center gap-6 ">
        <Link href="/">
          <Image src="/Logo.png" alt="Logo" width={40} height={40} />
        </Link>
        <Image src="/icons/Rectangle.png" width={50} height={1} />
        <nav className="flex flex-col gap-6">
          <Link href="/" className="  hover:bg-green-600/20 rounded-lg p-1">
            <Image src="/icons/dashboard.png" width={21} height={21} />
          </Link>
          <Link
            href="/help"
            className="  hover:bg-green-600/20  rounded-lg p-1"
          >
            <Image src="/icons/add.png " width={21} height={21} />
          </Link>
          <Link href="/help" className=" hover:bg-green-600/20  rounded-lg p-1">
            <Image src="/icons/Goals.png " width={21} height={21} />
          </Link>
          <Link href="/help" className=" hover:bg-green-600/20  rounded-lg p-1">
            <Image src="/icons/Sertif.png " width={21} height={21} />
          </Link>
        </nav>
      </div>

      <div className="flex flex-col gap-4 items-center">
        <Image src="/icons/Rectangle.png" width={50} height={1} />
        <Link
          href="/settings"
          className="hover:bg-green-600/20  rounded-lg p-1"
        >
          <Image src="/icons/Settings.png " width={21} height={21} />
        </Link>
        <Link href="/logout" className="hover:bg-green-600/20  rounded-lg p-1">
          <Image src="/icons/Logout.png " width={21} height={21} />
        </Link>
      </div>
    </aside>
  );
}
