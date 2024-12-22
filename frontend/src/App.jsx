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
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </CartProvider>
  );
}

export default App; 