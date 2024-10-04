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
      <div className='flex justify-center'>
   <p className='text-white text-4xl items-center mb-5'>Login</p> 
   </div>
  <form onSubmit={handleSubmit}>
  <InputBox
  label='Email'
  what='Enter your email'
  type='text'
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  />

  {/* <InputBox
  label='Password'
  what='Enter your password'
  type='password'
  onChange={(e) => setPassword(e.target.value)}
  /> */}

         <div className="relative">
            <InputBox
              label="Password"
              what="password"
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
            <div className="absolute inset-y-0 right-0 pr-3 mr-1 mt-4 flex items-center text-gray-400 cursor-pointer" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>


 <div className='flex justify-center'>
 <p className='text-white mt-4 text-center'> wait a minute after login</p>
 </div>

<div className='flex ml-3'>
  <Button 
  label='login'
  type ='submit'
  />
  </div>
 </form>

<div className='flex justify-center'>
    <p className='text-white text-center mt-4 ml-4'>
      Don't have an account?{' '}
    </p>
    </div>  

    <div className='flex justify-center'>
    <p className='text-center mr-8 ml-3'><Link to='/signup' className='text-blue-500 underline'>Sign up</Link> </p>
    </div>
    </div>
    
</div>

);
}
export default Login;