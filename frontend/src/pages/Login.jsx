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
    
    console.log(loginData);

    try {
      const response = await axios.post('https://wallet-1rzw.onrender.com/api/users/login', loginData, {
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
    <div className='flex justify-center items-center bg-slate-950 min-h-screen'>
      <div>
        <h1 className='text-white text-4xl ml-12 mb-10'>Login</h1>
        <form onSubmit={handleSubmit}> 
          <InputBox
            label="Email"
            what="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
          
          <div className="relative"> 
            <InputBox
              label="Password"
              what="Enter password"
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
            
            <div className="absolute inset-y-0 right-0 pr-3 mt-3 flex items-center text-gray-400 cursor-pointer" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />} 
            </div>
          </div>
          <p className='text-white mt-2 '>
          Wait for a minute after login
         </p>
         <div className='flex mr-4 justify-center'>
          <Button label="Login"  type="submit"  /> 
          </div>
        </form>
        
        <p className='text-white mt-4 ml-4'>
          Don't have an account?{' '}
        </p>
        <p className='flex justify-center mr-8 ml-3'><Link to='/signup' className='text-blue-500 underline'>Sign up</Link> </p>
      </div>
    </div>
  );
}

export default Login;

