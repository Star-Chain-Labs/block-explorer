import React, { useState } from 'react'
import ReusableForm from '../components/ReusableForm'
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleOnchange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className='w-full bg-gray-50 flex items-center justify-center py-10'>
      <div className='max-w-xl w-full bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden p-8'>
        <h1 className='text-3xl text-center font-bold mb-4'>Sign<span className='text-blue-700'>Up</span></h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <ReusableForm
            label={"Username"}
            name={"username"}
            type={"text"}
            value={formData.username}
            onChange={handleOnchange}
            placeholder={"Enter your username"}
            required
            icon={FaUser}
          />
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
          <ReusableForm
            label={"Password"}
            name={"password"}
            type={"password"}
            value={formData.password}
            onChange={handleOnchange}
            placeholder={"Enter your password"}
            required
            icon={FaLock}
          />
          <ReusableForm
            label={"Confirm Password"}
            name={"confirmPassword"}
            type={"password"}
            value={formData.confirmPassword}
            onChange={handleOnchange}
            placeholder={"Confirm your password"}
            required
            icon={FaLock}
          />
          
          <button
            type='submit'
            className='w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300'
          >
            {loading && <span className='spinner-border spinner-border-sm spinner-border-white mr-2'></span>}
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          <p className='text-center text-gray-600'>
            Already have an account?{" "}
            <Link
              to='/signin'
              className='text-blue-500 hover:text-blue-600 hover:underline transition duration-300'
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignUp