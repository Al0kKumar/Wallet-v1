import React, { useState } from 'react';
import { Box, Button, Card, Container, Grid, TextField, Typography, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const SendMoney = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [receiverid, setReceiverid] = useState('');
    const [amount, setAmount] = useState();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [name,setName] = useState('');

    const navigate = useNavigate();

    const handleSearch = async () => {
        setError(null); // Clear any previous error
        setSuccess(null);

        try {
            const token = localStorage.getItem('token'); 

            const response = await axios.post('https://wallet-v1-27cg.onrender.com/api/accounts/search', 
            { phoneNumber },
            {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });

            setReceiverid(response.data.id);
            setName(response.data.name);
            console.log(response.data.id);
            console.log(response.data.name);
            
            

        } catch (err) {
            console.error('Error searching for user:', err);
            if (err.response && err.response.data && err.response.data.msg) {
                setError(err.response.data.msg); 
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    const handleTransfer = async () => {
        setError(null); 
        setSuccess(null);

        try {
            const token = localStorage.getItem('token');

            const response = await axios.post('https://wallet-v1-27cg.onrender.com/api/accounts/wallettransfer', 
            { receiverid: String(receiverid), amount: Number(amount) },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert('Transfer successful!');
            setAmount(''); 
            navigate('/dashboard');

        } catch (err) {
            console.error('Error during transfer:', err);
            setError('Transfer failed. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Transfer Funds</Typography>

                {!receiverid && (
                    <>
                        <TextField
                            label="Recipient Phone Number"
                            variant="outlined"
                            fullWidth
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSearch}
                            sx={{ mb: 2 }}
                        >
                            Search User
                        </Button>
                    </>
                )}

                {/* Show User ID or Error */}
                {error && <Alert severity="error">{error}</Alert>}
                {receiverid && <Alert severity="success">User found! : {name}</Alert>}

                {/* Transfer Form (only shown if user is found) */}
                {receiverid && (
                    <>
                        <TextField
                            label="Amount to Transfer"
                            variant="outlined"
                            fullWidth
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleTransfer}
                        >
                            Transfer Funds
                        </Button>
                    </>
                )}

                {success && <Alert severity="success">{success}</Alert>}
            </Card>
        </Container>
    );
};

export default SendMoney