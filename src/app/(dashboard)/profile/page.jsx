"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ProfileInputField from "@/components/profile/ProfileInputField"; 
import LoadingModal from "@/components/loading/LoadingModal"; 

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    namaPerusahaan: "",
    alamat: "",
    jenisPerusahaan: "",
    emailPerusahaan: "", 
    jumlahKaryawan: "",
    jumlahUnitProduk: "",
    jumlahTonBarang: "",
    pendapatanPerusahaan: "",
  });
  const [originalData, setOriginalData] = useState({}); 
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchProfileData = async () => {
    setIsLoading(true);
    setError("");
    try {
      // const response = await fetch('/api/user/profile');
      // if (!response.ok) {
      //   throw new Error('Gagal mengambil data profile.');
      // }
      // const data = await response.json();

      const data = {
        namaPerusahaan: "CT Corporaton",
        alamat: "Jl. Teknologi Hijau No.88, Bandung, Jawa Barat",
        jenisPerusahaan: "Manufaktur, Produksi Barang",
        emailPerusahaan: "CTCorps@company.com",
        jumlahKaryawan: "250",
        jumlahUnitProduk: "12500",
        jumlahTonBarang: "180",
        pendapatanPerusahaan: "37500000",
      };

      const formattedData = {
        ...data,
        jumlahKaryawan: data.jumlahKaryawan
          ? `${data.jumlahKaryawan} Orang`
          : "",
        jumlahUnitProduk: data.jumlahUnitProduk
          ? `${data.jumlahUnitProduk} Unit Produk/Bulan`
          : "",
        jumlahTonBarang: data.jumlahTonBarang
          ? `${data.jumlahTonBarang} Ton Barang/Bulan`
          : "",
        pendapatanPerusahaan: data.pendapatanPerusahaan
          ? `Rp.${parseInt(data.pendapatanPerusahaan).toLocaleString(
              "id-ID"
            )}/Bulan`
          : "",
      };

      setProfileData(formattedData);
      setOriginalData(data); 
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memuat data profile.");
      console.error("Fetch profile error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setProfileData({
      namaPerusahaan: originalData.namaPerusahaan || "",
      alamat: originalData.alamat || "",
      jenisPerusahaan: originalData.jenisPerusahaan || "",
      emailPerusahaan: originalData.emailPerusahaan || "",
      jumlahKaryawan: originalData.jumlahKaryawan || "",
      jumlahUnitProduk: originalData.jumlahUnitProduk || "",
      jumlahTonBarang: originalData.jumlahTonBarang || "",
      pendapatanPerusahaan: originalData.pendapatanPerusahaan || "",
    });
    setIsEditing(true);
    setError("");
  };

  const handleSaveClick = async () => {
    setIsSubmitting(true); 
    setError("");

    try {
     
      const dataToSave = {
        ...profileData,
        jumlahKaryawan: parseInt(profileData.jumlahKaryawan) || 0,
        jumlahUnitProduk: parseInt(profileData.jumlahUnitProduk) || 0,
        jumlahTonBarang: parseInt(profileData.jumlahTonBarang) || 0,
        pendapatanPerusahaan: parseInt(profileData.pendapatanPerusahaan) || 0,
        emailPerusahaan: originalData.emailPerusahaan,
      };

      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT', // Atau POST, PATCH
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // 'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify(dataToSave),
      // });

      // if (!response.ok) {
      //   throw new Error('Gagal menyimpan perubahan profile.');
      // }

   
      console.log("Data yang akan dikirim:", dataToSave);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Profile berhasil diperbarui!");
      setIsEditing(false);
      fetchProfileData();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat menyimpan profile.");
      console.error("Save profile error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <LoadingModal isOpen={true} />
      </div>
    );
  }

  return (
    <div className="w-full max-h-screen bg-white text-gray-900 p-4 md:p-8 pt-20 md:pt-8 ">
      <div className="h-24 bg-tertiary-green -m-8" />
      <div className="flex items-center justify-between mb-8 mt-16 px-8 ">
        <div className="flex items-center space-x-4 ">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary-green px-8 ">
            <Image
              src="/company-logo.png"
              alt="Company Logo"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {profileData.namaPerusahaan}
            </h1>
            <p className="text-gray-500">{profileData.emailPerusahaan}</p>
          </div>
        </div>

        <button
          onClick={isEditing ? handleSaveClick : handleEditClick}
          disabled={isSubmitting}
          className={`rounded-md py-2 px-6 text-lg font-bold text-white ${
            isEditing
              ? "bg-primary-green hover:opacity-90"
              : "bg-primary-green hover:opacity-90"
          } disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? "Menyimpan..." : isEditing ? "Simpan" : "Edit"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-10 px-8 ">
        <div>
          <ProfileInputField
            label="Nama Perusahaan"
            name="namaPerusahaan"
            value={profileData.namaPerusahaan}
            onChange={handleChange}
            readOnly={!isEditing}
          />
          <ProfileInputField
            label="Alamat"
            name="alamat"
            value={profileData.alamat}
            onChange={handleChange}
            readOnly={!isEditing}
          />
          <ProfileInputField
            label="Jenis Perusahaan"
            name="jenisPerusahaan"
            value={profileData.jenisPerusahaan}
            onChange={handleChange}
            readOnly={!isEditing}
          />
          <ProfileInputField
            label="E-Mail Perusahaan"
            name="emailPerusahaan"
            value={profileData.emailPerusahaan}
            readOnly={true} 
          />
          <div className="mb-6 flex items-center space-x-3">
            <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {profileData.emailPerusahaan}
              </p>
              <p className="text-xs text-gray-500">1 month ago</p>{" "}
            </div>
          </div>
        </div>

        <div>
          <ProfileInputField
            label="Jumlah Karyawan"
            name="jumlahKaryawan"
            value={profileData.jumlahKaryawan}
            onChange={handleChange}
            readOnly={!isEditing}
            type="number" 
            placeholder="Masukkan Jumlah Karyawan"
          />
          <ProfileInputField
            label="Jumlah Unit Produk"
            name="jumlahUnitProduk"
            value={profileData.jumlahUnitProduk}
            onChange={handleChange}
            readOnly={!isEditing}
            type="number"
            placeholder="Masukkan Jumlah Unit Produk/Bulan"
          />
          <ProfileInputField
            label="Jumlah Ton Barang"
            name="jumlahTonBarang"
            value={profileData.jumlahTonBarang}
            onChange={handleChange}
            readOnly={!isEditing}
            type="number"
            placeholder="Masukkan Jumlah Ton Barang/Bulan"
          />
          <ProfileInputField
            label="Pendapatan Perusahaan"
            name="pendapatanPerusahaan"
            value={profileData.pendapatanPerusahaan}
            onChange={handleChange}
            readOnly={!isEditing}
            type="number" 
            placeholder="Masukkan Pendapatan Perusahaan/Bulan"
          />
        </div>
        <div className="pb-24 overflow-hidden bg-white "></div>
      </div>

      {error && (
        <p className="mt-8 text-center text-red-600 text-sm">{error}</p>
      )}

      <LoadingModal isOpen={isSubmitting} />
    </div>
  );
}
