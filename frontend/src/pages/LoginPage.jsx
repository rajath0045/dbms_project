import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import AuthService from '../services/auth.service';

const LoginPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
      const response = await AuthService.login(formData.username, formData.password);
      const role = AuthService.getCurrentUser()?.role;
      
      // Redirect based on role
      if (role === 'customer') {
        navigate('/customer/dashboard');
      } else if (role === 'supplier') {
        navigate('/supplier/dashboard');
      } else {
        setError('Invalid role or authentication error');
      }
    } catch (err) {
      setError(err.error || 'An error occurred during login');
    }
  };

  return (
    <div className="auth-page">
      <LoginForm onSubmit={handleLogin} error={error} />
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
