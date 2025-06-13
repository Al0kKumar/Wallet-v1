import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import InputBox from '../components/InputBox';
import Button from '../components/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

function Login() {
  const [email, setEmail] = useState('ak@gmail.com');
  const [password, setPassword] = useState('tiger');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const loginData = {
      email,
      password,
    };
    
    console.log(loginData);

    try {
      const response = await axios.post('http://localhost:3000/api/users/login', loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { token } = response.data;
       
      console.log(token);
      
      localStorage.setItem('token', token);

      console.log('Login Success:', response.data); 
      navigate('/dashboard'); 

    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data : error.message); 
      
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  return (
    <div className="flex justify-center items-center bg-gray-900 min-h-screen p-5">
      <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-8">
        <div className="flex justify-center">
          <p className="text-white text-4xl font-bold mb-8">Login</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-white text-sm mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 bg-transparent text-sm bg-gray-900 border border-white rounded-lg text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
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

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-200 ease-in-out"
            >
              Login
            </button>
          </div>
        </form>

        {/* Message */}
        <div className="text-center text-gray-400 text-sm mt-6">
          <p>Please wait a minute after login...</p>
        </div>

        {/* Sign Up Redirect */}
        <div className="text-center text-gray-400 text-sm mt-4">
          <p>Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:text-blue-600 underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;