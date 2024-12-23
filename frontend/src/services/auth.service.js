import api from '../utils/axios.config';

const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('userData');
  
  if (!userData) {
    return null;
  }

  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

const AuthService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, role, supplierId } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify({ role, supplierId }));
      localStorage.setItem('role', role);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  signup: async (formData) => {
    try {
        console.log("form",formData);
      const response = await api.post('/auth/register', {
        username: formData.username,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        address: formData.address,
        sname: formData.sname,
        scontact: formData.scontact,
        company_name: formData.company_name
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  getRole: () => {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    try {
      return JSON.parse(userData).role;
    } catch (error) {
      console.error('Error getting role:', error);
      return null;
    }
  },

  adminLogin: async (credentials) => {
    try {
      const response = await api.post('/auth/admin/login', credentials);
      const { token, role } = response.data;
      
      if (role !== 'admin') {
        throw new Error('Invalid admin credentials');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify({ role }));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default AuthService;
