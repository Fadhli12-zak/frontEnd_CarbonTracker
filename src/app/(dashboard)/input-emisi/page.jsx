"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ErrorModal from "@/components/popup/ErrorModal";
import Image from "next/image";

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

export default function InputEmisiPage() {
  const [formData, setFormData] = useState({
    listrik: "",
    genset: "",
    gasLpg: "",
    bbmSolar: "",
    bbmBensin: "",
    limbahPadat: "",
    limbahCair: "",
    transport2: "",
    transport1: "",
    perjalananDinas: "",
    ac1: "",
    ac2: "",
    konsumsiKertas: "",
    transportB: "",
    airBersih: "",
  });
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
    setModalMessage("");
    setShowModal(false);
    setIsLoading(true);

    const filledData = Object.entries(formData)
      .filter(([key, value]) => value !== "" && value !== null)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    if (Object.keys(filledData).length === 0) {
      setModalMessage("Harap isi setidaknya satu kolom input.");
      setShowModal(true);
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error(
          "Token autentikasi tidak ditemukan. Silakan login kembali."
        );
      }

      const sourceNameMapping = {
        listrik: "Listrik PLN",
        genset: "Genset",
        gasLpg: "LPG",
        bbmSolar: "BBM Solar / Diesel",
        bbmBensin: "BBM Bensin / Gasolin",
        limbahPadat: "Limbah Padat",
        limbahCair: "Limbah Cair",
        transport2: "Transportasi Operasional(Mobil Bensin)",
        transport1: "Transportasi Operasional(Mobil Diesel)",
        perjalananDinas: "Perjalanan Dinas(Pesawat Domestik)",
        ac1: "Air Conditioning(R-134a)",
        ac2: "Air Conditioning(R-410A)",
        konsumsiKertas: "Konsumsi Kertas",
        transportB: "Transportasi Barang",
        airBersih: "Air Bersih",
      };

      const emissionDataArray = Object.entries(filledData)
        .map(([key, value]) => {
          if (sourceNameMapping[key]) {
            return {
              source_name: sourceNameMapping[key],
              value: parseFloat(value) || 0,
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      if (emissionDataArray.length === 0) {
        setModalMessage(
          "Data yang diisi tidak valid atau tidak ada di mapping."
        );
        setShowModal(true);
        setIsLoading(false);
        return;
      }

      const requestBody = {
        emission_data: emissionDataArray,
      };

      const inputApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/emission-inputs/with-details`;

      console.log("Mengirim data input ke:", inputApiUrl);
      console.log("Body Input:", JSON.stringify(requestBody, null, 2));

      const resInput = await fetch(inputApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Status API Input:", resInput.status);
      const responseDataInput = await resInput.json();
      console.log("Respon Data Input:", responseDataInput);

      if (!resInput.ok) {
        throw new Error(
          responseDataInput.message || "Gagal menyimpan data input emisi."
        );
      }

      const input_id = responseDataInput.data?.input_id;

      if (!input_id) {
        console.error(
          "Respon API Input tidak mengandung input_id:",
          responseDataInput
        );
        throw new Error(
          "Gagal mendapatkan input_id dari server setelah menyimpan."
        );
      }

      const resultApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/emission-results`;
      console.log(
        "Meminta kalkulasi hasil ke:",
        resultApiUrl,
        "dengan input_id:",
        input_id
      );

      const resResult = await fetch(resultApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          input_id: input_id,
        }),
      });

      console.log("Status API Result:", resResult.status);
      const responseDataResult = await resResult.json();
      console.log("Respon Data Result:", responseDataResult);

      if (!resResult.ok) {
        throw new Error(
          responseDataResult.message || "Gagal memproses hasil kalkulasi emisi."
        );
      }

      alert("Data emisi berhasil disimpan dan diproses!");
      router.push("/emisi");
    } catch (err) {
      console.error("Submit error:", err);
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
        <div className="mb-10">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
            Energi
          </h2>
          <InputField
            label="Listrik PLN"
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
            label="LPG"
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
            label="BBM Solar / Diesel"
            name="bbmSolar"
            unit="Liter"
            value={formData.bbmSolar}
            onChange={handleChange}
            number="01"
          />
          <InputField
            label="BBM Bensin / Gasolin"
            name="bbmBensin"
            unit="Liter"
            value={formData.bbmBensin}
            onChange={handleChange}
            number="02"
          />
          <InputField
            label="Transportasi Operasional (Mobil Bensin)"
            name="transport2"
            unit="Liter"
            value={formData.transport2}
            onChange={handleChange}
            number="03"
          />
          <InputField
            label="Transportasi Operasional (Mobil Diesel)"
            name="transport1"
            unit="Liter"
            value={formData.transport1}
            onChange={handleChange}
            number="04"
          />
          <InputField
            label="Perjalanan Dinas (Pesawat Domestik)"
            name="perjalananDinas"
            unit="Km"
            value={formData.perjalananDinas}
            onChange={handleChange}
            number="05"
          />
          <InputField
            label="Transportasi Barang"
            name="transportB"
            unit="Km"
            value={formData.transportB}
            onChange={handleChange}
            number="06"
          />
        </div>

        <div className="mb-10">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
            Pendingin / AC
          </h2>
          <InputField
            label="Air Conditioning (R-134a)"
            name="ac1"
            unit="Kg"
            value={formData.ac1}
            onChange={handleChange}
            number="01"
          />
          <InputField
            label="Air Conditioning (R-410A)"
            name="ac2"
            unit="Kg"
            value={formData.ac2}
            onChange={handleChange}
            number="02"
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
      </form>

      <ErrorModal
        isOpen={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
