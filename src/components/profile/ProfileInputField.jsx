import React from "react";

const ProfileInputField = ({
  label,
  value,
  name,
  type = "text",
  readOnly,
  onChange,
  placeholder = "",
}) => {
  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`block w-full rounded-md shadow-sm p-3 border ${
          readOnly
            ? "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
            : "border-[#C0BDBD] focus:border-primary-green focus:ring-primary-green text-gray-900"
        }`}
      />
    </div>
  );
};

export default ProfileInputField;
