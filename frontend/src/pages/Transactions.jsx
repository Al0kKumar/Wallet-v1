import React, { useState, useEffect } from 'react';
import { Card, Grid, List, ListItem, Typography } from '@mui/material';
import axios from 'axios'; // Assuming you're using axios for fetching

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions when the component mounts
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from local storage
        const transactionsResponse = await axios.get(
          'http://localhost:3000/api/accounts/transactionshistory',
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the JWT in the request
            },
          }
        );

            setTransactions(transactionsResponse.data);
          
      } catch (error) {
        console.error('Error fetching transactions:', error); // Handle error
      }
    };
      
    fetchTransactions();
  }, []); // Empty dependency array ensures this runs once after component mounts

  return (
    <Grid item xs={12} md={8} lg={9}>
      <Card
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#fff',
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recent Transactions
        </Typography>
        <List>
          {transactions.map((tx, index) => (
            <ListItem key={index}>
              <Typography variant="body2">
                {tx.date} - {tx.bank} - ₹{tx.amount}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Card>
    </Grid>
  );
};

export default Transactions;
