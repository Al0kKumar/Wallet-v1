import React, { useState } from 'react';
import { Box, Button, Card, Container, Grid, Typography, TextField } from '@mui/material';
import HDFCLogo from '../assets/Hdfc.jpg'; // Adjust the path as necessary
import AxisLogo from '../assets/Axis.jpg'; // Adjust the path as necessary
import IciciLogo from '../assets/Icici.jpg'; // Adjust the path as necessary
import SbiLogo from '../assets/Sbi.jpg'; // Adjust the path as necessary
import axios from 'axios';
import {useNavigate} from 'react-router-dom'


const banks = [
  { name: 'HDFC', logo: HDFCLogo },
  { name: 'Axis', logo: AxisLogo },
  { name: 'ICICI', logo: IciciLogo },
  { name: 'SBI', logo: SbiLogo },
];
const AddFunds = () => {
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [pin, setPin] = useState('');
  const [amount, setAmount] = useState('');

  const navigate = useNavigate();

  const handleBankClick = (bank) => {
    setSelectedBank(bank);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
         'https://wallet-1rzw.onrender.com/api/accounts/deposit',
        {
          bank: selectedBank.name,
          accountNumber,
          pin,
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Funds added successfully!');
      navigate('/dashboard');

    } catch (error) {
      console.error('Error adding funds:', error);
      alert('Failed to add funds.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6">Select Bank</Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {banks.map((bank) => (
              <Grid item xs={6} key={bank.name}>
                <Button onClick={() => handleBankClick(bank)} fullWidth>
                  <img src={bank.logo} alt={bank.name} style={{ width: '100px' }} />
                </Button>
              </Grid>
            ))}
          </Grid>

          {selectedBank && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">Enter Account Details for {selectedBank.name}</Typography>
              <TextField
                label="Account Number"
                fullWidth
                sx={{ mt: 2 }}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
              <TextField
                label="PIN"
                type="password"
                fullWidth
                sx={{ mt: 2 }}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <TextField
                label="Amount"
                fullWidth
                sx={{ mt: 2 }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleSubmit}>
                Confirm
              </Button>
            </Box>
          )}
        </Card>
      </Box>
    </Container>
  );
};

export default AddFunds;
