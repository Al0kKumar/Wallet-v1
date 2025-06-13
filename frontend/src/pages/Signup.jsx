import React, { useState } from 'react';
import axios from 'axios';
import InputBox from '../components/InputBox';
import Button from '../components/Button';     
import { useNavigate, Link } from 'react-router-dom';  
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

function Signup() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const userData = { name, phoneNumber, email, password };

    try {
      setErrorMessage(''); 
      const response = await axios.post('http://localhost:3000/api/users/signup', userData, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('Success:', response.data);

      alert('Signed up successfully! Redirecting to login...');

      setTimeout(() => {
        navigate('/login');
      }, 2000); 

    } catch (error) {
      const errorResponse = error.response ? error.response.data.msg : 'An error occurred. Please try again.';
      setErrorMessage(errorResponse);
      console.log('Error', errorResponse);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="flex justify-center items-center bg-gray-900 min-h-screen p-5">
      <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-8">
        <div className="flex justify-center">
          <h1 className="text-white text-4xl font-bold mb-8">Sign Up</h1>
        </div>

        {/* Error message (if any) */}
        {errorMessage && (
          <div className="mb-4 p-2 bg-red-600 text-white rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-white text-sm mb-2">Name</label>
            <input
              type="text"
              id="name"
              className="w-full p-3 text-sm bg-gray-900 border border-white  rounded-lg text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Phone Number Input */}
          <div className="mb-6">
            <label htmlFor="phoneNumber" className="block text-white text-sm mb-2">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              className="w-full p-3 text-sm bg-gray-900 border border-white rounded-lg text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-white text-sm mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 text-sm bg-gray-900 border border-white rounded-lg text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input with Eye Icon */}
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-white text-sm mb-2">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="w-full p-3 text-sm bg-gray-900 border border-white rounded-lg text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 mt-6 flex items-center cursor-pointer text-gray-400" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Signup Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-200 ease-in-out"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Message after signup */}
        <div className="text-center text-gray-400 text-sm mt-6">
          <p>Please wait a minute after signup...</p>
        </div>

        {/* Redirect to Login */}
        <div className="text-center text-gray-400 text-sm mt-4">
          <p>Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-600 underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
