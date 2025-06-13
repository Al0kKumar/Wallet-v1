import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Card,
  Container,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu'; // Import Menu icon

const Dashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    navigate('/login');
  };

  const getTransactions = () => {
    navigate('/transactions');
  };

  const handleAddFundsClick = () => {
    navigate('/add-funds');
  };

  const handleWithdrawClick = () => {
    navigate('/withdraw');
  };

  const handleTransferClick = () => {
    navigate('/send');
  };

  const [balance, setBalance] = useState(0);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false); // State for drawer open/close

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      try {
        const balanceResponse = await axios.get('https://wallet-v1-27cg.onrender.com/api/users/userdetails', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBalance(balanceResponse.data.balance);
        setUserName(balanceResponse.data.name);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        variant="temporary" 
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)} 
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#1c1e21',
            color: '#fff',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button onClick={getTransactions} sx={{ cursor: 'pointer' }}>
              <ListItemIcon sx={{ color: '#fff' }}>
                <AccountBalanceWalletIcon />
              </ListItemIcon>
              <ListItemText primary="Transactions" />
            </ListItem>
            <ListItem button onClick={logout} sx={{ cursor: 'pointer' }}>
              <ListItemIcon sx={{ color: '#fff' }}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <AppBar position="sticky" sx={{ bgcolor: '#2c3e50', color: '#fff' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)} sx={{ mr: 2 }}>
              <MenuIcon /> 
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Wallet Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4} lg={3}>
              <Card
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: '#e3f2fd',
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="textSecondary" align="center">
                  Welcome, {userName}!
                </Typography>
                <Typography variant="body1" color="textSecondary" align="center">
                  Account Balance
                </Typography>
                <Typography variant="h4" color="primary" sx={{ mt: 1 }}>
                  ₹{balance}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: 'space-around',
                  bgcolor: '#e0f7fa',
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddFundsClick} sx={{ mb: { xs: 1, md: 0 } }}>
                  Add Funds
                </Button>
                <Button variant="contained" color="secondary" startIcon={<RemoveIcon />} onClick={handleWithdrawClick} sx={{ mb: { xs: 1, md: 0 } }}>
                  Withdraw
                </Button>
                <Button variant="contained" startIcon={<TransferWithinAStationIcon />} onClick={handleTransferClick}>
                  Transfer
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
