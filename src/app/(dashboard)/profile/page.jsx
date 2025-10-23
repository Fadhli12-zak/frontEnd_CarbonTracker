// src/app/(dashboard)/profile/page.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProfileInputField from "@/components/profile/ProfileInputField";
import LoadingModal from "@/components/loading/LoadingModal";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    namaPerusahaan: "",
    alamat: "",
    jenisPerusahaan: "",
    emailPerusahaan: "Memuat email...",
    jumlahKaryawan: "",
    jumlahUnitProduk: "",
    jumlahTonBarang: "",
    pendapatanPerusahaan: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchProfileData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }
      const companyApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/companies`;
      const companyResponse = await fetch(companyApiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!companyResponse.ok) {
        if (companyResponse.status === 401 || companyResponse.status === 403) {
          localStorage.removeItem("authToken");
          router.push("/login");
          return;
        }
        const errorData = await companyResponse.json();
        throw new Error(
          errorData.message || "Gagal mengambil data perusahaan."
        );
      }

      const companyData = await companyResponse.json();
      console.log("Profile Data API (Companies):", companyData);
      const userApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`;
      const userResponse = await fetch(userApiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!userResponse.ok) {
        throw new Error("Gagal mengambil data email pengguna.");
      }

      const userData = await userResponse.json();
      const userEmail = userData.data?.email || "Email tidak ditemukan";

      if (
        companyData.success &&
        Array.isArray(companyData.data) &&
        companyData.data.length > 0
      ) {
        const company = companyData.data[0];
        setCompanyId(company.company_id);
        setOriginalData(company);

        const formattedData = {
          namaPerusahaan: company.name || "",
          alamat: company.address || "",
          jenisPerusahaan: company.jenis_perusahaan || "",
          emailPerusahaan: userEmail,
          jumlahKaryawan: company.jumlah_karyawan
            ? `${company.jumlah_karyawan} Orang`
            : "",
          jumlahUnitProduk: company.unit_produk_perbulan
            ? `${company.unit_produk_perbulan} Unit Produk/Bulan`
            : "",
          jumlahTonBarang: company.ton_barang_perbulan
            ? `${company.ton_barang_perbulan} Ton Barang/Bulan`
            : "",
          pendapatanPerusahaan: company.pendapatan_perbulan
            ? `Rp.${parseFloat(company.pendapatan_perbulan).toLocaleString(
                "id-ID"
              )}/Bulan`
            : "",
        };
        setProfileData(formattedData);
      } else if (
        companyData.success &&
        Array.isArray(companyData.data) &&
        companyData.data.length === 0
      ) {
        router.push("/company-data");
        return;
      } else {
        throw new Error("Format data profile tidak sesuai.");
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memuat data profile.");
      console.error("Fetch profile error:", err);
      if (err.message.includes("Token")) {
        setTimeout(() => router.push("/login"), 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numberRegex = /^[0-9]*\.?[0-9]*$/;
    const numericFields = [
      "jumlahKaryawan",
      "jumlahUnitProduk",
      "jumlahTonBarang",
      "pendapatanPerusahaan",
    ];

    if (numericFields.includes(name)) {
      if (numberRegex.test(value) || value === "") {
        setProfileData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditClick = () => {
    if (!originalData) return;
    setProfileData({
      namaPerusahaan: originalData.name || "",
      alamat: originalData.address || "",
      jenisPerusahaan: originalData.jenis_perusahaan || "",
      emailPerusahaan: profileData.emailPerusahaan,
      jumlahKaryawan: originalData.jumlah_karyawan || "",
      jumlahUnitProduk: originalData.unit_produk_perbulan || "",
      jumlahTonBarang: originalData.ton_barang_perbulan || "",
      pendapatanPerusahaan: originalData.pendapatan_perbulan || "",
    });
    setIsEditing(true);
    setError("");
  };
  const handleSaveClick = async () => {
    if (!companyId) {
      setError("ID Perusahaan tidak ditemukan untuk update.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const dataToSave = {
        name: profileData.namaPerusahaan,
        address: profileData.alamat,
        jenis_perusahaan: profileData.jenisPerusahaan,
        jumlah_karyawan: parseInt(profileData.jumlahKaryawan) || null,
        unit_produk_perbulan: parseInt(profileData.jumlahUnitProduk) || null,
        ton_barang_perbulan: parseFloat(profileData.jumlahTonBarang) || null,
        pendapatan_perbulan:
          parseFloat(profileData.pendapatanPerusahaan) || null,
      };

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan.");
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/companies/${companyId}`;
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSave),
      });
      const responseData = await response.json();
      console.log("Update response:", responseData);
      if (!response.ok) {
        throw new Error(responseData.message || "Gagal menyimpan perubahan.");
      }

      alert("Profile berhasil diperbarui!");
      setIsEditing(false);
      fetchProfileData();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat menyimpan.");
      console.error("Save profile error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-grow bg-white min-h-screen">
        <LoadingModal isOpen={true} />
      </div>
    );
  }

  return (
    <div className="w-full bg-white text-gray-900 min-h-full flex flex-col">
      <div className="h-24 bg-tertiary-green px-4 md:px-8 flex-shrink-0" />
      <div className="p-4 md:p-8 flex-grow">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 -mt-16 md:-mt-16 px-4 md:px-0">
          <div className=" mt-20 flex flex-col md:flex-row items-center text-center md:text-left space-y-3 md:space-y-0 md:space-x-4 mb-4 md:mb-0">
            <div className="  relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary-green bg-white flex-shrink-0">
              <Image
                src="/companyPicture.png"
                alt="Company Logo"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {profileData.namaPerusahaan}
              </h1>
              <p className="text-sm md:text-base text-gray-500">
                {profileData.emailPerusahaan}
              </p>
            </div>
          </div>
          <button
            onClick={isEditing ? handleSaveClick : handleEditClick}
            disabled={isSubmitting}
            className={`rounded-md py-2 px-6 text-base md:text-lg font-bold text-white w-full md:w-auto ${
              isEditing
                ? "bg-primary-green hover:opacity-90"
                : "bg-primary-green hover:opacity-90"
            } disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? "Menyimpan..." : isEditing ? "Simpan" : "Edit"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 md:gap-y-6 mt-10">
          <div>
            <ProfileInputField
              label="Nama Perusahaan"
              name="namaPerusahaan"
              value={profileData.namaPerusahaan}
              onChange={handleChange}
              readOnly={!isEditing}
              type="text"
            />
            <ProfileInputField
              label="Alamat"
              name="alamat"
              value={profileData.alamat}
              onChange={handleChange}
              readOnly={!isEditing}
              type="text"
            />
            <ProfileInputField
              label="Jenis Perusahaan"
              name="jenisPerusahaan"
              value={profileData.jenisPerusahaan}
              onChange={handleChange}
              readOnly={!isEditing}
              type="text"
            />
            <div className="mb-6 flex items-center space-x-3 mt-6 md:mt-8">
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full flex-shrink-0">
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
                <p className="text-xs text-gray-500">1 month ago</p>
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
              type="text"
              inputMode={isEditing ? "numeric" : undefined}
              placeholder={isEditing ? "Masukkan Angka" : ""}
            />
            <ProfileInputField
              label="Jumlah Unit Produk"
              name="jumlahUnitProduk"
              value={profileData.jumlahUnitProduk}
              onChange={handleChange}
              readOnly={!isEditing}
              type="text"
              inputMode={isEditing ? "numeric" : undefined}
              placeholder={isEditing ? "Masukkan Angka" : ""}
            />
            <ProfileInputField
              label="Jumlah Ton Barang"
              name="jumlahTonBarang"
              value={profileData.jumlahTonBarang}
              onChange={handleChange}
              readOnly={!isEditing}
              type="text"
              inputMode={isEditing ? "numeric" : undefined}
              placeholder={isEditing ? "Masukkan Angka" : ""}
            />
            <ProfileInputField
              label="Pendapatan Perusahaan"
              name="pendapatanPerusahaan"
              value={profileData.pendapatanPerusahaan}
              onChange={handleChange}
              readOnly={!isEditing}
              type="text"
              inputMode={isEditing ? "numeric" : undefined}
              placeholder={isEditing ? "Masukkan Angka (tanpa Rp./titik)" : ""}
            />
          </div>
        </div>
        <div className="h-56 bg-white" />
        {error && (
          <p className="mt-8 text-center text-red-600 text-sm">{error}</p>
        )}
      </div>
      <LoadingModal isOpen={isSubmitting} />
    </div>
  );
}
