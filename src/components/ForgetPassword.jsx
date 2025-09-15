import React, { useState } from 'react'
import { FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ReusableForm from './ReusableForm';
import OtpModel from './OtpModel';

const ForgetPassword = () => {
    const [formData, setFormData] = useState({
        email: "",
    });
    const [loading, setLoading] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);

    const handleOnchange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className='w-full bg-gray-50 flex items-center justify-center py-20'>
            <div className='max-w-xl w-full bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden p-8'>
                <h1 className='text-3xl text-center font-bold mb-4'>Reset <span className='text-blue-700'>Password</span></h1>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <ReusableForm
                        label={"Email"}
                        name={"email"}
                        type={"email"}
                        value={formData.email}
                        onChange={handleOnchange}
                        placeholder={"Enter your email"}
                        required
                        icon={FaEnvelope}
                    />
                    <button
                        disabled={loading}
                        type='submit'
                        className='w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300'
                    >
                        {loading && <span className='spinner-border spinner-border-sm spinner-border-white mr-2'></span>}
                        {loading ? "Sending otp..." : "Send OTP"}
                    </button>
                    <p className='text-center text-gray-600'>
                        <Link
                            to='/signin'
                            className='text-blue-500 hover:text-blue-600 hover:underline transition duration-300'
                        >
                            Back to Login
                        </Link>
                    </p>
                </form>
            </div>

            {
                showOtpModal && <OtpModel setShowOtpModal={setShowOtpModal} email={formData.email} />
            }
        </div>
    )
}

export default ForgetPassword
