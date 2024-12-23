import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Stack
} from '@mui/material';
import {
  People as PeopleIcon,
  ShoppingCart as CartIcon,
  Inventory as InventoryIcon,
  Business as BusinessIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Layers as MaterialsIcon
} from '@mui/icons-material';
import AuthService from '../services/auth.service';
import api from '../utils/axios.config';
import StatsCard from '../components/admin/StatsCard';

const AdminDashboard = () => {
 
  const navigate = useNavigate();

  

  const handleLogout = () => {
    AuthService.logout();
    navigate('/admin/login');
  };

  const navigationButtons = [
    {
      text: 'Customers List',
      icon: <PeopleIcon />,
      onClick: () => navigate('/admin/customers'),
      color: 'primary'
    },
    {
      text: 'Products List',
      icon: <InventoryIcon />,
      onClick: () => navigate('/admin/products'),
      color: 'warning'
    },
    {
      text: 'Suppliers List',
      icon: <BusinessIcon />,
      onClick: () => navigate('/admin/suppliers'),
      color: 'secondary'
    },
    {
      text: 'Raw Materials',
      icon: <MaterialsIcon />,
      onClick: () => navigate('/admin/materials'),
      color: 'success'
    },
    {
      text: 'Orders List',
      icon: <CartIcon />,
      onClick: () => navigate('/admin/orders'),
      color: 'info'
    },
    {
      text: 'Add Product',
      icon: <AddIcon />,
      onClick: () => navigate('/admin/products/add'),
      color: 'warning'
    },
    {
      text: 'Logout',
      icon: <LogoutIcon />,
      onClick: handleLogout,
      color: 'error'
    }
  ];

  

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        
        <Grid container spacing={2}>
          {navigationButtons.map((button, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Button
                variant="contained"
                color={button.color}
                startIcon={button.icon}
                onClick={button.onClick}
                fullWidth
                sx={{ py: 2 }}
              >
                {button.text}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Users"
            
            icon={<PeopleIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Orders"
           
            icon={<CartIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Products"
            
            icon={<InventoryIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Suppliers"
           
            icon={<BusinessIcon />}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 