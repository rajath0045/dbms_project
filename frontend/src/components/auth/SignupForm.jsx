import React, { useState } from 'react';
import './AuthForm.css';

const SignupForm = ({ onSubmit, error }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    phone: '',
    address: '',
    sname: '',
    scontact: '',
    company_name: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Sign Up</h2>
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="role">Role</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="customer">Customer</option>
          <option value="supplier">Supplier</option>
        </select>
      </div>

      {formData.role === 'customer' && (
        <>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </>
      )}

      {formData.role === 'supplier' && (
        <>
          <div className="form-group">
            <label htmlFor="sname">Supplier Name</label>
            <input
              type="text"
              id="sname"
              name="sname"
              value={formData.sname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="scontact">Contact Number</label>
            <input
              type="text"
              id="scontact"
              name="scontact"
              value={formData.scontact}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company_name">Company Name</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
            />
          </div>
        </>
      )}

      <button type="submit" className="submit-button">
        Sign Up
      </button>
    </form>
  );
};

export default SignupForm;
