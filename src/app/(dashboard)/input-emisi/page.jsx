"use client";

import error from "next/error";
import { useState } from "react";
import { useRouter } from "next/navigation";

const InputField = ({
  category,
  number,
  label,
  name,
  unit,
  placeholder = "Masukkan Jumlah Bulanan",
  value,
  onChange,
}) => (
  <div className="mb-6">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {number}.{label}
    </label>
    <div className="relative">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*\.?[0-9]*"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full rounded-md border-[#C0BDBD] shadow-sm p-3 border focus:border-primary-green focus:ring-primary-green pr-20"
      />
      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 text-sm">
        {unit}
      </span>
    </div>
  </div>
);

function ErrorModal({ isOpen, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-xl font-bold text-red-600 mb-4">Peringatan!</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-primary-green px-4 py-2 text-white font-medium hover:opacity-90"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InputEmisiPage() {
  const [formData, setFormData] = useState({
    listrik: "",
    genset: "",
    gasLpg: "",
    bbmSolar: "",
    bbmBensin: "",
    bbmOperasional: "",
    perjalananDinas: "",
    transportasiBarang: "",
    konsumsiKertas: "",
    airBersih: "",
    limbahPadat: "",
    limbahCair: "",
  });
  // const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numberRegex = /^[0-9]*\.?[0-9]*$/;
    if (numberRegex.test(value) || value === "") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset modal
    setModalMessage("");
    setShowModal(false);
    setIsLoading(true);

    if (Object.values(formData).some((value) => value === "")) {
      setModalMessage("Semua kolom input wajib diisi!");
      setShowModal(true);
      setIsLoading(false);
      return;
    }

    try {
      console.log("Data siap dikirim:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // const res = await fetch('URL_API_EMISI', { /* ... */ });
      // if (!res.ok) throw new Error('Gagal menyimpan data emisi.');

      alert("Data emisi berhasil disimpan!");
      router.push("/emisi");
    } catch (err) {
      setModalMessage(err.message || "Terjadi kesalahan saat menyimpan.");
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white text-gray-900 p-4 md:p-8 pt-20 md:pt-8 relative">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-primary-green">
        Input Data Emisi
      </h1>
      <form onSubmit={handleSubmit}>
        {/* === Kategori Energi === */}
        <div className="mb-10">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
            Energi
          </h2>
          <InputField
            label="Listrik"
            name="listrik"
            unit="kWh"
            value={formData.listrik}
            onChange={handleChange}
            number="01"
          />
          <InputField
            label="Genset"
            name="genset"
            unit="kW"
            value={formData.genset}
            onChange={handleChange}
            number="02"
          />
          <InputField
            label="Gas/LPG"
            name="gasLpg"
            unit="Kg"
            value={formData.gasLpg}
            onChange={handleChange}
            number="03"
          />
        </div>
        <div className="mb-10">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
            Transportasi & Logistik
          </h2>
          <InputField
            label="BBM Solar/Diesel"
            name="bbmSolar"
            unit="Liter"
            value={formData.bbmSolar}
            onChange={handleChange}
            number="01"
          />
          <InputField
            label="BBM Bensin/Gasolin"
            name="bbmBensin"
            unit="Liter"
            value={formData.bbmBensin}
            onChange={handleChange}
            number="02"
          />
          <InputField
            label="BBM Kendaraan Operasional"
            name="bbmOperasional"
            unit="Liter"
            value={formData.bbmOperasional}
            onChange={handleChange}
            number="03"
          />
          <InputField
            label="Perjalanan Dinas"
            name="perjalananDinas"
            unit="Km"
            value={formData.perjalananDinas}
            onChange={handleChange}
            number="04"
          />
          <InputField
            label="Transportasi Barang"
            name="transportasiBarang"
            unit="Km"
            value={formData.transportasiBarang}
            onChange={handleChange}
            number="05"
          />
        </div>
        <div className="mb-10">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
            Produksi & Material
          </h2>
          <InputField
            label="Konsumsi Kertas"
            name="konsumsiKertas"
            unit="Kg"
            value={formData.konsumsiKertas}
            onChange={handleChange}
            number="01"
          />
          <InputField
            label="Air Bersih"
            name="airBersih"
            unit="Liter/m³"
            value={formData.airBersih}
            onChange={handleChange}
            number="02"
          />
        </div>
        <div className="mb-10">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
            Limbah
          </h2>
          <InputField
            label="Limbah Padat"
            name="limbahPadat"
            unit="Kg/Ton"
            value={formData.limbahPadat}
            onChange={handleChange}
            number="01"
          />
          <InputField
            label="Limbah Cair"
            name="limbahCair"
            unit="Liter/m³"
            value={formData.limbahCair}
            onChange={handleChange}
            number="02"
          />
        </div>
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-44 rounded-3xl border border-transparent bg-primary-green py-2 px-6 text-lg font-bold text-white hover:opacity-90 disabled:bg-gray-400"
          >
            {isLoading ? "Menghitung..." : "Hitung"}
          </button>
        </div>
        {error && (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        )}
        "
      </form>
      <ErrorModal
        isOpen={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
