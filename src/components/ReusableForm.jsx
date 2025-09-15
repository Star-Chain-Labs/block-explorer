"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // 👈 icons for toggle

const ReusableForm = ({
    label,
    name,
    type,
    value,
    onChange,
    placeholder,
    options,
    required = false,
    className = "",
    icon: Icon,
    disabled = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputBase =
        "w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 outline-none";

    const renderInput = () => {
        switch (type) {
            case "textarea":
                return (
                    <textarea
                        id={name}
                        name={name}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        required={required}
                        className={`${inputBase} ${Icon ? "pl-10" : ""} ${className}`}
                    />
                );

            case "select":
                return (
                    <select
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        required={required}
                        className={`${inputBase} ${className}`}
                    >
                        <option value="">Select {label}</option>
                        {options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );

            case "radio":
                return (
                    <div className="flex gap-4">
                        {options?.map((opt) => (
                            <label key={opt.value} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name={name}
                                    value={opt.value}
                                    checked={value === opt.value}
                                    onChange={onChange}
                                    required={required}
                                />
                                {opt.label}
                            </label>
                        ))}
                    </div>
                );

            case "file":
                return (
                    <input
                        id={name}
                        name={name}
                        type="file"
                        onChange={onChange}
                        required={required}
                        className={`w-full cursor-pointer border border-gray-400 text-gray-700 file:bg-gray-200 file:text-gray-700 file:border-0 file:mr-4 file:px-4 file:rounded-md file py-2 rounded-lg p-3 ${className}`}
                    />
                );

            default:
                return (
                    <div className="relative">
                        <input
                            id={name}
                            name={name}
                            type={type === "password" ? (showPassword ? "text" : "password") : type}
                            placeholder={placeholder}
                            value={type !== "file" ? value : undefined}
                            onChange={onChange}
                            required={required}
                            className={`${inputBase} ${Icon ? "pl-10" : ""} ${className}`}
                            disabled={disabled}
                        />

                        {/* 👁 Toggle button for password */}
                        {type === "password" && (
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="space-y-2">
            {label && (
                <label htmlFor={name} className="block font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <Icon
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                        size={20}
                    />
                )}
                {renderInput()}
            </div>
        </div>
    );
};

export default ReusableForm;
