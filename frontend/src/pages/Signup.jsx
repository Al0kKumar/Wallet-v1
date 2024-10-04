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
      const response = await axios.post('https://wallet-1rzw.onrender.com/api/users/signup', userData, {
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
    <div className='bg-slate-950 flex justify-center items-center h-screen'>
      <div>
        
        <h1 className="text-white  text-4xl mb-11 ml-9">Sign Up</h1>
        
        {errorMessage && (
          <div className="mb-4 p-2 bg-red-600 text-white rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <InputBox
            label="Name"
            what="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputBox
            label="Phone Number"
            what="phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)} 
          />
          <InputBox
            label="Email"
            what="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
          
          <div className="relative">
            <InputBox
              label="Password"
              what="password"
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
            <div className="absolute inset-y-0 right-0 pr-3 mr-5 mt-3 flex items-center text-gray-400 cursor-pointer" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
           
          <p className='text-white mt-2'>
          Wait for a minute after signup
        </p>
        <div className='flex'>
          <Button label="Sign Up" type="submit" /> 
          </div>
        </form>

        <p className='text-white mt-4'>
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 underline ">Login</Link>
        </p>
        
      </div>
    </div>
  );
}

export default Signup;