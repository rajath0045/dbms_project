import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent
} from '@mui/material';
import api from '../utils/axios.config';
import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const MATERIAL_TYPES = [
  'cotton', 'wool', 'silk', 'linen', 'polyester', 'nylon', 'rayon',
  'acrylic', 'bamboo', 'jute', 'hemp', 'ramie', 'polypropylene'
];

const SupplierDashboard = () => {
  const [materialStats, setMaterialStats] = useState([]);
  const [materialEntries, setMaterialEntries] = useState([]);
  const [newMaterial, setNewMaterial] = useState({
    material_type: '',
    quantity: ''
  });
  const [error, setError] = useState('');
  const [supplierId] = useState(() => {
    const userData = AuthService.getCurrentUser();
    return userData?.supplierId;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!supplierId) {
      setError('No supplier ID found. Please log in again.');
    }
  }, [supplierId]);

  useEffect(() => {
    fetchMaterialStats();
    fetchMaterialEntries();
  }, []);

  const fetchMaterialStats = async () => {
    try {
      const response = await api.get('/raw-materials/stats');
      setMaterialStats(response.data);
    } catch (err) {
      setError('Failed to fetch material statistics');
    }
  };

  const fetchMaterialEntries = async () => {
    try {
      const response = await api.get('/raw-materials');
      setMaterialEntries(response.data);
    } catch (err) {
      setError('Failed to fetch material entries');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Include supplier_id in the request payload
      const materialData = {
        ...newMaterial,
        supplier_id: supplierId
      };
      
      console.log('Submitting material:', materialData); // Debug log
      
      await api.post('/raw-materials', materialData);
      setNewMaterial({ material_type: '', quantity: '' });
      fetchMaterialStats();
      fetchMaterialEntries();
    } catch (err) {
      console.error('Error adding material:', err); // Debug log
      setError('Failed to add material');
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
          Supplier Dashboard
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      {/* Add New Material Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add New Raw Material
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Material Type</InputLabel>
                <Select
                  value={newMaterial.material_type}
                  onChange={(e) => setNewMaterial({
                    ...newMaterial,
                    material_type: e.target.value
                  })}
                  required
                >
                  {MATERIAL_TYPES.map(material => (
                    <MenuItem key={material} value={material}>
                      {material.charAt(0).toUpperCase() + material.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quantity(in kg)"
                type="number"
                value={newMaterial.quantity}
                onChange={(e) => setNewMaterial({
                  ...newMaterial,
                  quantity: e.target.value
                })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Add Material
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Material Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {materialStats.map((stat) => (
          <Grid item xs={12} sm={6} md={4} key={stat.material_type}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {stat.material_type.charAt(0).toUpperCase() + stat.material_type.slice(1)}
                </Typography>
                <Typography variant="body1">
                  Total Quantity: {stat.total_quantity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last Entry: {new Date(stat.last_entry).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Entries Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Material Entries
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Material Type</TableCell>
                <TableCell>Quantity(in kg)</TableCell>
                <TableCell>Date Added</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materialEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {entry.material_type.charAt(0).toUpperCase() + entry.material_type.slice(1)}
                  </TableCell>
                  <TableCell>{entry.quantity}</TableCell>
                  <TableCell>
                    {new Date(entry.date_added).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default SupplierDashboard; 