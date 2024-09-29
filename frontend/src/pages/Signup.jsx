import React, { useState } from 'react';
import axios from 'axios';
import InputBox from '../components/InputBox';
import Button from '../components/Button';     
import { useNavigate } from 'react-router-dom';  


function Signup() {
  // State variables for storing user input
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage,setErrorMessage] = useState('');

  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Prepare the data to be sent
    const userData = {
      name,
      phoneNumber,
      email,
      password,
    };

    try {
       
      setError('')

      const response = await axios.post('http://localhost:3000/api/users/signup', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Success:', response.data); // Handle success (e.g., show a success message)
      
      navigate('/dashboard');

    } catch (error) {
      const errorResponse = error.response ? error.response.data.msg : 'An error occurred. Please try again.';
      setErrorMessage(errorResponse);
      console.log('Error',errorResponse);
      
    }
  };

  return (
    <div className='bg-slate-950 flex justify-center items-center h-screen'>
      <div>
        <h1 className="text-white text-4xl mb-11 ml-7">Sign Up</h1>
         
         {/* Display error message if it exists */}
        {errorMessage && (
          <div className="mb-4 p-2 bg-red-600 text-white rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}> {/* Wrap inputs in a form */}
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
            onChange={(e) => setPhoneNumber(e.target.value)} // Update state on change
          />
          <InputBox
            label="Email"
            what="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update state on change
          />
          <InputBox
            label="Password"
            what="password"
            type="password" // Ensure password input is masked
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update state on change
          />

          <Button label="Sign Up" type="submit" /> {/* Change button type to submit */}
        </form>
      </div>
    </div>
  );
}

export default Signup;

