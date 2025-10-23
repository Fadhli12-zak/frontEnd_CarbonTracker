"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import StatusModal from "@/components/popup/StatusModal";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [modalStatus, setModalStatus] = useState("success");
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowStatusModal(false);
    setIsLoading(true);
    localStorage.removeItem("redirectAfterLogin");

    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi");
      setIsLoading(false);
      return;
    }

    const loginApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/login`;
    try {
      const loginRes = await fetch(loginApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const loginData = await loginRes.json();
      console.log("Respon Login:", loginData);

      if (!loginRes.ok) {
        setModalStatus("error");
        setShowStatusModal(true);
        setIsLoading(false);
        return;
      }

      if (loginData.data && loginData.data.token) {
        const token = loginData.data.token;
        localStorage.setItem("authToken", token);
        const checkCompanyApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/companies`;
        document.cookie = `authToken=${token}; path=/; max-age=86400; SameSite=None; Secure`;
        console.log("Token berhasil disimpan di localStorage dan Cookie");
        try {
          const companyRes = await fetch(checkCompanyApiUrl, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const companyData = await companyRes.json();
          console.log(
            "Respon Cek Perusahaan:",
            JSON.stringify(companyData, null, 2)
          );

          if (!companyRes.ok) {
            console.error(
              "Gagal memeriksa data perusahaan:",
              companyData.message
            );
            localStorage.setItem("redirectAfterLogin", "/");
            setModalStatus("success");
            setModalMessage("Login Berhasil! (Gagal cek data perusahaan)");
            setShowStatusModal(true);
          } else {
            if (
              companyData.success &&
              Array.isArray(companyData.data) &&
              companyData.data.length > 0
            ) {
              console.log("User punya perusahaan, set redirect ke /");
              localStorage.setItem("redirectAfterLogin", "/");
              setModalStatus("success");
              setModalMessage("Login Berhasil!");
              setShowStatusModal(true);
            } else if (
              companyData.success &&
              Array.isArray(companyData.data) &&
              companyData.data.length === 0
            ) {
              console.log(
                "User belum punya perusahaan, set redirect ke /inputData"
              );
              localStorage.setItem("redirectAfterLogin", "/inputData");
              setModalStatus("success");
              setModalMessage(
                "Login Berhasil! Silakan lengkapi data perusahaan Anda."
              );
              setShowStatusModal(true);
            }
          }
        } catch (companyCheckError) {
          console.error("Error saat cek perusahaan:", companyCheckError);
          setModalStatus("error");
          setModalMessage(
            "Login berhasil, tetapi gagal memeriksa data perusahaan."
          );
          setShowStatusModal(true);
          localStorage.setItem("redirectAfterLogin", "/");
        }
      } else {
        throw new Error("Login berhasil tetapi token tidak diterima.");
      }
    } catch (err) {
      console.error("Login/Check Process Error:", err);
      setModalStatus("error");
      setModalMessage(err.message || "Terjadi kesalahan.");
      setShowStatusModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowStatusModal(false);
    if (modalStatus === "success") {
      const redirectTarget = localStorage.getItem("redirectAfterLogin") || "/";
      localStorage.removeItem("redirectAfterLogin");
      console.log("Redirecting to:", redirectTarget);
      router.push(redirectTarget);
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
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
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
                disabled={isLoading}
                className="h-12 w-full rounded-full bg-primary-green p-1 font-bold text-white transition hover:bg-green-700 disabled:bg-gray-400"
              >
                {isLoading ? "Memproses..." : "Masuk"}
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

      <StatusModal
        isOpen={showStatusModal}
        status={modalStatus}
        context="login"
        messageOverride={modalMessage}
        onClose={handleCloseModal}
      />
    </div>
  );
}
