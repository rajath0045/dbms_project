import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../utils/axios.config';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Chip,
  CardActions,
  Button,
  Paper,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/format';


const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    gender: 'all',
    search: '',
    sortBy: 'none'
  });
  const [addingToCart, setAddingToCart] = useState({});
  const [selectedQuantities, setSelectedQuantities] = useState({});

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.gender !== 'all') {
      result = result.filter(product => product.category === filters.gender);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.material.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.sortBy === 'price-asc') {
      return result.sort((a, b) => a.unit_price - b.unit_price);
    } else if (filters.sortBy === 'price-desc') {
      return result.sort((a, b) => b.unit_price - a.unit_price);
    }

    return result;
  }, [filters, products]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuantityChange = (productId, value) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  const handleAddToCart = useCallback(async (product) => {
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    try {
      const quantity = selectedQuantities[product.id] || 1;
      await addToCart(product, quantity);
    } catch (error) {
      setError('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  }, [addToCart, selectedQuantities]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
        Welcome to Textile Store
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              name="search"
              placeholder="Search products..."
              value={filters.search}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Sort by</InputLabel>
              <Select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                label="Sort by"
              >
                <MenuItem value="none">Default</MenuItem>
                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                <MenuItem value="price-desc">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Box mb={2}>
        <Typography variant="subtitle1" color="text.secondary">
          Showing {filteredProducts.length} products
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {filteredProducts.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box 
                sx={{ 
                  p: 2, 
                  backgroundColor: 'grey.100', 
                  height: 200, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'placeholder-image-url';
                    }}
                  />
                ) : (
                  <Typography color="text.secondary">Product Image</Typography>
                )}
              </Box>
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {product.name}
                  </Typography>
                  <Chip
                    label={product.category}
                    color="primary"
                    size="small"
                  />
                </Box>
                
                <Typography color="text.secondary" gutterBottom>
                  Material: {product.material}
                </Typography>
                
                <Typography color="text.secondary" gutterBottom>
                  In Stock: {product.aval_quantity}
                </Typography>
                
                <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
                  {formatPrice(product.unit_price)}
                </Typography>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={selectedQuantities[product.id] || 1}
                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        disabled={product.aval_quantity === 0}
                      >
                        {[...Array(product.aval_quantity)].map((_, index) => (
                          <MenuItem key={index + 1} value={index + 1}>
                            {index + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={8}>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.aval_quantity === 0 || addingToCart[product.id]}
                    >
                      {product.aval_quantity === 0 
                        ? 'Out of Stock' 
                        : addingToCart[product.id] 
                          ? 'Adding...' 
                          : 'Add to Cart'}
                    </Button>
                  </Grid>
                </Grid>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredProducts.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No products found
          </Typography>
          <Typography color="text.secondary">
            Try adjusting your filters or search terms
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default CustomerDashboard; 