import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CustomerDashboard from './pages/CustomerDashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ThemeProvider, createTheme } from '@mui/material';
import { CartProvider } from './contexts/CartContext';
import DashboardLayout from './components/layout/DashboardLayout';
import OrdersPage from './pages/OrdersPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import CustomersList from './pages/CustomersList';
import SuppliersList from './pages/SuppliersList';
import MaterialsList from './pages/MaterialsList';
import AdminOrdersList from './pages/AdminOrdersList';
import AddProduct from './pages/AddProduct';
import ProductsList from './pages/ProductsList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c5282',
    },
  },
});

function App() {
  return (
    <CartProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <DashboardLayout>
                    <CustomerDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/orders"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <DashboardLayout>
                    <OrdersPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/supplier/dashboard"
              element={
                <ProtectedRoute allowedRoles={['supplier']}>
                  <SupplierDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CustomersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/suppliers"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SuppliersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/materials"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <MaterialsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminOrdersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/add"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AddProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ProductsList />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </CartProvider>
  );
}

export default App; 