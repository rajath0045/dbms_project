import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Container,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Receipt as OrdersIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import { useCart } from '../../contexts/CartContext';
import Cart from '../cart/Cart';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const user = AuthService.getCurrentUser();
  const { cart } = useCart();
  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Textile Store
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1">
              Welcome, {user?.username}
            </Typography>
            
            <Button 
              color="inherit" 
              startIcon={<OrdersIcon />}
              onClick={() => navigate('/customer/orders')}
            >
              Orders
            </Button>
            
            <IconButton 
              color="inherit" 
              onClick={() => setCartOpen(true)}
            >
              <Badge badgeContent={cart.length} color="error">
                <CartIcon />
              </Badge>
            </IconButton>
            
            <Button 
              color="inherit" 
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Cart Drawer */}
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      >
        <Cart onClose={() => setCartOpen(false)} />
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8, // To account for the AppBar height
          px: 3,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout; 