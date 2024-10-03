import React, { useEffect, useState } from 'react';
import { AppBar, Box, Card, Container, Drawer, Grid, List, ListItem, ListItemText, Toolbar, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('https://wallet-1rzw.onrender.com/api/accounts/transactionshistory', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to load transactions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 260,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 260,
            boxSizing: 'border-box',
            backgroundColor: '#1c1e21',
            color: '#fff',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer' }}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => navigate('/transactions')} sx={{ cursor: 'pointer' }}>
              <ListItemText primary="Transactions" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="sticky" sx={{ bgcolor: '#2c3e50', color: '#fff' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Transactions
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card sx={{ p: 3, boxShadow: 3 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Transaction History</Typography>
                <List>
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <ListItem key={transaction.id}>
                        <ListItemText
                          primary={`${transaction.type === 'WALLET_TO_WALLET' ? 'Wallet Transfer' : transaction.type === 'BANK_TO_WALLET' ? 'Bank to Wallet' : 'Wallet to Bank'}`}
                          secondary={`
                            Amount: ₹${transaction.amount} |
                            ${
                              transaction.type === 'WALLET_TO_WALLET'
                                ? `Sender: ${transaction.sendername || 'N/A'} | Receiver: ${transaction.receivername || 'N/A'}`
                                : `Bank: ${transaction.bank || 'N/A'}`
                            } | Date: ${new Date(transaction.createdAt).toLocaleDateString()}`}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Typography>No transactions available.</Typography>
                  )}
                </List>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Transactions;
