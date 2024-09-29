import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputBox from '../components/InputBox';
import Button from '../components/Button';

function Login() {
  // State variables for storing user input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Prepare the data to be sent
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

      const {token} = response.data;
       
      console.log(token);
      
      localStorage.setItem('token',token);

      console.log('Login Success:', response.data); // Handle success (e.g., redirect user or show a message)
      // You could also store a token or user information if received
      navigate('/dashboard');

    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data : error.message); // Handle error
      // You could show an error message to the user here
    }
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
          <InputBox
            label="Password"
            what="Enter password"
            type="password" // Ensure password input is masked
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update state on change
          />
          <Button label="Login" type="submit" /> {/* Change button type to submit */}
        </form>
      </div>
    </div>
  );
}

export default Login;
