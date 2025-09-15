import React from "react";

const OtpModal = ({ setShowOtpModal, email }) => {

    const handleVerify = async () => {
        try {

        } catch (error) {
            console.log("Error verifying OTP:", error);
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md relative animate-fadeIn">
                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                    OTP Verification
                </h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                    Enter the 6-digit code sent to <span className="font-medium">{email}</span>
                </p>

                {/* OTP Inputs */}
                <div className="flex justify-between gap-2 mb-6">
                    {Array(6)
                        .fill("")
                        .map((_, i) => (
                            <input
                                key={i}
                                type="text"
                                maxLength="1"
                                className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                            />
                        ))}
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition"
                        onClick={() => setShowOtpModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                    >
                        Verify
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OtpModal;
