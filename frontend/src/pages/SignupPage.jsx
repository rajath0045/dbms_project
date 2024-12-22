import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm';
import AuthService from '../services/auth.service';

const SignupPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (formData) => {
    try {
      await AuthService.signup(
        formData
      );
      navigate('/login');
    } catch (err) {
      setError(err.error || 'An error occurred during signup');
    }
  };

  return (
    <div className="auth-page">
      <SignupForm onSubmit={handleSignup} error={error} />
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignupPage;
