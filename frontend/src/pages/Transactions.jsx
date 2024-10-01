import React, { useState, useEffect } from 'react';
import { Card, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import { format } from 'date-fns';

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

  const getIcon = (type) => {
    switch (type) {
      case 'WALLET_TO_WALLET':
        return <TransferWithinAStationIcon color="primary" />;
      case 'BANK_TO_WALLET':
        return <AccountBalanceIcon color="success" />;
      case 'WALLET_TO_BANK':
        return <MoneyOffIcon color="error" />;
      default:
        return null;
    }
  };

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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Bank</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx, index) => (
                <TableRow key={index}>
                  <TableCell>{format(new Date(tx.createdAt), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {getIcon(tx.type)}
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {tx.type}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell>{tx.bank || 'N/A'}</TableCell>
                  <TableCell>₹{tx.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Grid>
  );
};

export default Transactions;
