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

      console.log('Login Success:', response.data); // Handle success (e.g., redirect user or show a message)
      navigate('/dashboard'); // Redirect to dashboard on success

    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data : error.message); // Handle error
      
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className='flex justify-center items-center bg-slate-950 min-h-screen'>
      <div>
        <h1 className='text-white text-4xl ml-10 mb-10'>Login</h1>
        <form onSubmit={handleSubmit}> {/* Wrap inputs in a form */}
          <InputBox
            label="Email"
            what="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update state on change
          />
          
          <div className="relative"> {/* Relative container for password input and eye icon */}
            <InputBox
              label="Password"
              what="Enter password"
              type={showPassword ? "text" : "password"} // Toggle input type between text and password
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update state on change
            />
            
            {/* Eye icon for toggling password visibility */}
            <div className="absolute inset-y-0 right-0 pr-3 mt-3 flex items-center text-gray-400 cursor-pointer" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Show appropriate icon */}
            </div>
          </div>
          
          <Button label="Login" type="submit" /> {/* Change button type to submit */}
        </form>
        
        {/* Add a link to sign up page */}
        <p className='text-white mt-4'>
          Don't have an account?{' '}
        </p>
        <p className='flex justify-center mr-8'><Link to='/signup' className='text-blue-500 underline'>Sign up</Link> {/* Signup link */}</p>
      </div>
    </div>
  );
}

export default Login;

