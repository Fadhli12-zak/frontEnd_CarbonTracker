"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";

export default function CompanyDataPage() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    jenis_perusahaan: "",
    jumlah_karyawan: "",
    pendapatan_perbulan: "",
    ton_barang_perbulan: "",
    unit_produk_perbulan: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTypeSelect = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      jenis_perusahaan: type,
    }));
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    for (const key in formData) {
      if (!formData[key]) {
        setError(
          `Kolom "${key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}" wajib diisi.`
        );
        setIsLoading(false);
        return;
      }
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error(
          "Token autentikasi tidak ditemukan. Silakan login kembali."
        );
      }
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/companies/for-user`;
      console.log("Mengirim data ke:", apiUrl);
      console.log("Data:", formData);

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      console.log("Status API:", res.status);
      const responseData = await res.json();
      console.log("Respon data:", responseData);
      if (!res.ok) {
        throw new Error(responseData.message || "Gagal menyimpan data.");
      }
      alert("Data perusahaan berhasil disimpan!");
      router.push("/");
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
 
  const companyTypes = [
    "Kantor, IT, Startup, Finansial",
    "Manufaktur, Produksi Barang",
    "Transportasi, Logistik",
    "Retail",
    "Energi / Tambang",
    "Pemerintahan / Gedung Perkantoran",
  ];

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex justify-center">
          <Image src="/Logo.png" alt="Logo" width={80} height={80} />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Data Perusahaan</h1>
          <p className="mt-2 text-lg text-gray-600">
            Lengkapi Data Perusahaanmu!
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Perusahaan
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nama Lengkap Perusahaan"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-primary-green focus:ring-primary-green"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Alamat
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder="Alamat Perusahaan"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-primary-green focus:ring-primary-green"
            />
          </div>

          <div>
            <label
              htmlFor="jenis_perusahaan"
              className="block text-sm font-medium text-gray-700"
            >
              Jenis Perusahaan
            </label>
            <button
              type="button"
              id="jenis_perusahaan"
              onClick={() => setIsOpen(!isOpen)}
              className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 bg-white p-3 text-left shadow-sm focus:border-primary-green focus:ring-primary-green"
            >
              <span
                className={
                  formData.jenis_perusahaan ? "text-black" : "text-gray-500"
                }
              >
                {formData.jenis_perusahaan || "Pilih Jenis Perusahaan"}
              </span>
              <FaChevronDown
                className={`transform transition-transform duration-200 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {isOpen && (
              <div className="mt-1 w-full overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">
                {companyTypes.map((type) => (
                  <div
                    key={type}
                    onClick={() => handleTypeSelect(type)}
                    className="cursor-pointer border-b border-gray-200 p-3 hover:bg-gray-100 last:border-b-0"
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="jumlah_karyawan"
              className="block text-sm font-medium text-gray-700"
            >
              Jumlah Karyawan
            </label>
            <input
              id="jumlah_karyawan"
              name="jumlah_karyawan"
              type="text"
              value={formData.jumlah_karyawan}
              onChange={handleChange}
              placeholder="Jumlah Karyawan Perusahaan"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-primary-green focus:ring-primary-green"
            />
          </div>
          <div>
            <label
              htmlFor="pendapatan_perbulan"
              className="block text-sm font-medium text-gray-700"
            >
              Jumlah Unit Produk
            </label>
            <input
              id="pendapatan_perbulan"
              name="pendapatan_perbulan"
              type="text"
              value={formData.pendapatan_perbulan}
              onChange={handleChange}
              placeholder="Jumlah Unit/Bulan"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-primary-green focus:ring-primary-green"
            />
          </div>
          <div>
            <label
              htmlFor="ton_barang_perbulan"
              className="block text-sm font-medium text-gray-700"
            >
              Jumlah Ton Barang
            </label>
            <input
              id="ton_barang_perbulan"
              name="ton_barang_perbulan"
              type="text"
              value={formData.ton_barang_perbulan}
              onChange={handleChange}
              placeholder="Jumlah Ton Barang/Bulan"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-primary-green focus:ring-primary-green"
            />
          </div>

          <div>
            <label
              htmlFor="unit_produk_perbulan"
              className="block text-sm font-medium text-gray-700"
            >
              Pendapatan Perusahaan
            </label>
            <input
              id="unit_produk_perbulan"
              name="unit_produk_perbulan"
              type="text"
              value={formData.unit_produk_perbulan}
              onChange={handleChange}
              placeholder="Jumlah Pendapatan/Bulan"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-primary-green focus:ring-primary-green"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary-green py-3 px-4 text-lg font-bold text-white hover:opacity-90 disabled:bg-gray-400"
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>

          {error && <p className="text-center text-sm text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
}
