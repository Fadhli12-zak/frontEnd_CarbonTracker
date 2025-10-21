"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function RegisterStatusModal({ isOpen, status, onClose }) {
  if (!isOpen) return null;

  const successInfo = {
    title: "Pendaftaran",
    highlight: "Berhasil!",
    image: "/popup/success.png",
    highlightColor: "text-green-600",
    buttonColor: "bg-green-600",
    message: "Silahkan Login Kembali",
  };

  const errorInfo = {
    title: "Pendaftaran",
    highlight: "Gagal",
    image: "/popup/failed.png",
    highlightColor: "text-red-600",
    buttonColor: "bg-red-600",
    message: "Silahkan Coba Lagi",
  };

  const info = status === "success" ? successInfo : errorInfo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <h3 className={`text-2xl font-bold mb-4 text-black`}>
          {info.title}{" "}
          <span className={info.highlightColor}>{info.highlight}</span>
        </h3>
        <div className="my-6 flex justify-center">
          <Image
            src={info.image}
            alt={status === "success" ? "Success" : "Error"}
            width={200}
            height={150}
            objectFit="contain"
          />
        </div>
        <p className="text-gray-700 text-lg mb-6">{info.message}</p>
        <button
          onClick={onClose}
          className={`rounded-full ${info.buttonColor} px-8 py-2 text-white font-semibold hover:opacity-90`}
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [modalStatus, setModalStatus] = useState("success");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowRegisterModal(false);

    if (!form.username || !form.email || !form.password) {
      setError("Semua kolom input wajib diisi");
      return;
    }
    if (!validatePassword(form.password)) {
      setError(
        "Password harus minimal 8 karakter, mengandung huruf besar, kecil, angka dan simbol."
      );
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        setModalStatus("error");
        setShowRegisterModal(true);
        return;
      }

      setModalStatus("success");
      setShowRegisterModal(true);
    } catch (err) {
      console.error("Submit Error:", err);
      setModalStatus("error");
      setShowRegisterModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowRegisterModal(false);
    if (modalStatus === "success") {
      router.push("/login");
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row-reverse relative">
      <div
        className="relative hidden w-full flex-col items-center justify-center bg-cover bg-center p-10 text-white md:flex md:w-1/2"
        style={{ backgroundImage: "url('/Bgentrance.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-primary-green to-transparent"></div>
        <div className="relative z-10 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">
            Sudah memiliki akun?
          </h2>
          <p className="mb-8 max-w-sm text-xl md:max-w-2xl md:text-2xl">
            Masuk dan Hitung Dampak Emisimu!
          </p>
          <Link
            href="/login"
            className="rounded-full bg-white px-8 py-3 font-bold text-primary-green transition hover:bg-gray-200"
          >
            Masuk
          </Link>
        </div>
      </div>

      <div className="flex w-full flex-grow flex-col items-center justify-start bg-white p-6 md:w-1/2 md:flex-grow-0 md:p-10">
        <div className="w-full max-w-sm md:max-w-md md:my-0">
          <div className="mb-8 text-center md:mb-4">
            <div className="mb-8 mt-8 md:mb-24 md:mt-0">
              <Image
                src="/Logo.png"
                alt="Logo"
                width={60}
                height={60}
                className="mx-auto md:w-20 md:h-20"
              />
            </div>
            <h1 className="mb-1 mt-8 text-4xl font-bold text-black md:mb-2 md:text-5xl">
              Daftar
            </h1>
            <p className="text-gray-500 md:text-lg ">Masukkan Data diri Anda</p>
          </div>
          <div className="md:mb-0">
            <form onSubmit={handleSubmit}>
              <div className="mb-4 md:mb-5">
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  className="h-14 w-full rounded-full border-none bg-gray-100 p-4 pl-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 md:h-16"
                />
              </div>
              <div className="mb-4 md:mb-5">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="h-14 w-full rounded-full border-none bg-gray-100 p-4 pl-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 md:h-16"
                />
              </div>
              <div className=" relative mb-4 md:mb-5">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
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
                disabled={isLoading}
                className="h-12 w-full rounded-full bg-primary-green p-4 font-bold text-white transition hover:bg-green-700 flex items-center justify-center disabled:bg-gray-400"
              >
                {isLoading ? "Memproses..." : "Daftar"}
              </button>
              {error && (
                <p className="mt-3 text-center text-sm text-red-600 ">
                  {error}
                </p>
              )}
              <div className="md:hidden">
                <div className="mt-8 mb-4 border-t border-gray-300"></div>
                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-block rounded-full border border-gray-300 bg-gray-50 px-6 py-3 text-sm font-semibold text-primary-green transition hover:bg-gray-100"
                  >
                    sudah punya akun? Masuk
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <RegisterStatusModal
        isOpen={showRegisterModal}
        status={modalStatus}
        onClose={handleCloseModal}
      />
    </div>
  );
}
