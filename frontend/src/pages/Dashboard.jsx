import React, { useEffect, useState } from 'react';
import { AppBar, Box, Button, Card, Container, Drawer, Grid, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  
  const navigate = useNavigate();

  const getTransactions = () => {
    navigate('/transactions')
  }

  const handleAddFundsClick = () => {
    navigate('/add-funds'); // Navigate to the Add Funds page
  };

  const handlewithdrawClick = () => {
    navigate('/withdraw')
  }

  const handleTransferClick = () => {
    navigate('/send')
  }

  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); 

  useEffect( () => {

    const fetchdata = async ()=> {
       const token = localStorage.getItem('token');
        
      
        
    // Fetch wallet balance
    try {
        const balanceResponse = await axios.get('http://localhost:3000/api/users/userdetails', {
            headers: {
              Authorization: `Bearer ${token}`, // Include the JWT in the request
            },
          });
          setBalance(balanceResponse.data.balance);
    
        
    } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false after requests complete
      }
    };


    fetchdata();
    }, []);


  if (loading) {
    return <Typography variant="h6">Loading...</Typography>; // Loading indicator
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>; // Error message
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
          {/* Sidebar items with icons */}
          <ListItem button>
            <ListItemIcon sx={{ color: '#fff' }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button  onClick={getTransactions} sx={{ cursor: 'pointer' }}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <AccountBalanceWalletIcon />
            </ListItemIcon>
            <ListItemText primary="Transactions"  />
          </ListItem>
          <ListItem button>
            <ListItemIcon sx={{ color: '#fff' }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem button>
            <ListItemIcon sx={{ color: '#fff' }}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Drawer>

    {/* Main Content */}
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      {/* Sticky AppBar */}
      <AppBar position="sticky" sx={{ bgcolor: '#2c3e50', color: '#fff' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Wallet Dashboard
          </Typography>
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          {/* Account Balance Card */}
          <Grid item xs={12} md={4} lg={3}>
            <Card
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#e3f2fd',
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" color="textSecondary">
                Account Balance
              </Typography>
              <Typography variant="h4" color="primary" sx={{ mt: 1 }}>
                ₹{balance}
              </Typography>
            </Card>
          </Grid>

          

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Card
              sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'space-around',
                bgcolor: '#e0f7fa',
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddFundsClick}>
                Add Funds
              </Button>
              <Button variant="contained" color="secondary" startIcon={<RemoveIcon />} onClick={handlewithdrawClick}>
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
