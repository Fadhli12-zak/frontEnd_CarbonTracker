"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen flex-row-reverse">
      <div
        className="relative flex w-1/2 flex-col items-center justify-center bg-cover bg-center p-10 text-white"
        style={{ backgroundImage: "url('/Bgentrance.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-primary-green to-transparent"></div>
        <div className="relative z-10 text-center">
          <h2 className="mb-4 text-5xl font-bold">Sudah memiliki akun?</h2>
          <p className="mb-8 max-w-2xl">Masuk dan Hitung Dampak Emisimu!</p>
          <Link
            href="/login"
            className="rounded-full bg-white px-8 py-3 font-bold text-primary-green transition hover:bg-gray-200"
          >
            Masuk
          </Link>
        </div>
      </div>
      <div className="flex w-1/2 flex-col items-center justify-center bg-white p-10">
        <div className="w-full max-w-xl">
          <div className="mb-4 text-center">
            <div className="mb-24">
              <Image
                src="/Logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="mx-auto"
              />
            </div>

            <h1 className="mb-2 mt-24 text-5xl font-bold text-black">Daftar</h1>
            <p className="text-gray-500 text-lg ">Masukkan Data diri Anda</p>
          </div>
          <div className="mb-56">
            <form>
              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Username"
                  className="h-16 w-full rounded-full border-none bg-gray-100 p-4 pr-12 pl-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-5">
                <input
                  type="email"
                  placeholder="Email"
                  className="h-16 w-full rounded-full border-none bg-gray-100 p-4 pr-12 pl-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className=" relative mb-5">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="h-16 w-full rounded-full border-none bg-gray-100 py-4 pr-12 pl-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center pr-3 text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-primary-green p-4 font-bold text-white transition hover:bg-green-700"
              >
                Daftar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
