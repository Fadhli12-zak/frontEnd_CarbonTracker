"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password) {
      setError("Username dan password wajib diisi");
      return;
    }
    try {
      const res = await fetch("url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Username atau kata sandi salah.");
        return;
      }

      alert("Login Berhasil!");
      router.push("/");
    } catch (err) {
      setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div
        className="relative hidden w-full flex-col items-center justify-center bg-cover bg-center p-10 text-white md:flex md:w-1/2"
        style={{ backgroundImage: "url('/Bgentrance.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-primary-green to-transparent"></div>
        <div className="relative z-10 text-center">
          <h2 className="mb-4 max-w-full text-3xl font-bold md:text-5xl">
            Belum memiliki akun?
          </h2>
          <p className="mb-8 text-xl md:text-2xl">
            Daftar dan Ketahui Dampak Emisimu!
          </p>
          <Link
            href="/register"
            className="rounded-full bg-white px-8 py-3 font-bold text-primary-green transition hover:bg-gray-200"
          >
            Daftar
          </Link>
        </div>
      </div>

      <div className="flex w-full flex-grow flex-col items-center justify-start bg-white p-6 md:w-1/2 md:flex-grow-0 md:p-10">
        <div className="w-full max-w-sm md:max-w-md md:my-0">
          <div className="mb-8 text-center md:mb-4">
            <div className="mb-8 mt-8 md:mb-36 md:mt-0">
              <Image
                src="/Logo.png"
                alt="Logo"
                width={60}
                height={60}
                className="mx-auto md:w-20 md:h-20"
              />
            </div>
            <h1 className="mb-1 mt-8 text-4xl font-bold text-black md:mb-2 md:text-5xl">
              Masuk
            </h1>
            <p className="text-gray-500 md:text-lg">Masukkan Data diri Anda</p>
          </div>
          <div className="md:mb-0">
            <form onSubmit={handleSubmit}>
              <div className="mb-4 md:mb-5">
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Username atau email"
                  className="h-14 w-full rounded-full border-none bg-gray-100 p-4 pl-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 md:h-16"
                />
              </div>
              <div className="relative mb-4 md:mb-5">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="h-14 w-full rounded-full border-none bg-gray-100 py-4 pr-12 pl-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 md:h-16"
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
                className="h-12 w-full rounded-full bg-primary-green p-1 font-bold text-white transition hover:bg-green-700"
              >
                Masuk
              </button>
              {error && (
                <p className="mt-3 text-center text-sm text-red-600">{error}</p>
              )}

              <div className="md:hidden">
                <div className="mt-8 mb-4 border-t border-gray-300"></div>
                <div className="text-center">
                  <Link
                    href="/register"
                    className="inline-block rounded-full border border-gray-300 bg-gray-50 px-6 py-3 text-sm font-semibold text-primary-green transition hover:bg-gray-100"
                  >
                    Buat akun baru
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
