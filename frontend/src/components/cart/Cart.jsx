import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Divider,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/format';
import api from '../../utils/axios.config';

const Cart = ({ onClose }) => {
  const { cart, removeFromCart, clearCart } = useCart();
  
  const total = cart.reduce((sum, item) => {
    const itemTotal = Number(item.unit_price) * (item.quantity || 1);
    return sum + (isNaN(itemTotal) ? 0 : itemTotal);
  }, 0);

  const handleCheckout = async () => {
    try {
      const response = await api.post('/orders', {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity || 1,
          unit_price: item.unit_price
        })),
        total_price: total
      });
      
      clearCart();
      onClose();
      // You might want to show a success message and/or redirect to orders page
    } catch (error) {
      console.error('Checkout error:', error);
      // Handle error (show error message)
    }
  };

  return (
    <Box sx={{ width: 350, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Shopping Cart
      </Typography>
      
      {cart.length === 0 ? (
        <Typography color="text.secondary">
          Your cart is empty
        </Typography>
      ) : (
        <>
          <List>
            {cart.map((item) => (
              <ListItem key={item.id}>
                <ListItemText
                  primary={item.name}
                  secondary={`${item.quantity || 1} x ${formatPrice(item.unit_price)}`}
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    onClick={() => removeFromCart(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Total: {formatPrice(total)}
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCheckout}
            sx={{ mt: 2 }}
          >
            Checkout
          </Button>
        </>
      )}
    </Box>
  );
};

export default Cart; 