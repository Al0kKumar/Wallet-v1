import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import InputBox from '../components/InputBox';
import Button from '../components/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const loginData = {
      email,
      password,
    };

    try {
      const response = await axios.post('https://wallet-1rzw.onrender.com/api/users/login', loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { token } = response.data;

      localStorage.setItem('token', token);
      navigate('/dashboard'); // Redirect to dashboard on success

    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data : error.message); // Handle error
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className='flex justify-center items-center bg-slate-950 min-h-screen p-4'>
      <div className='bg-white rounded-lg shadow-lg p-8 w-full max-w-md'>
        <h1 className='text-gray-800 text-3xl font-bold mb-6 text-center'>Login</h1>
        <form onSubmit={handleSubmit}>
          <InputBox
            label="Email"
            what="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <div className="relative mb-4">
            <InputBox
              label="Password"
              what="Enter password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          
          <Button label="Login" type="submit" />
        </form>
        
        <p className='text-gray-600 mt-4 text-center'>
          Don't have an account?{' '}
          <Link to='/signup' className='text-blue-500 underline'>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
