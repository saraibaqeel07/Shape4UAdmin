import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '@/services/api';
import { CircularProgress, Box } from '@mui/material';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  // Check authentication status on mount and set up axios interceptors
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
          // Set the authorization header for all future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(JSON.parse(savedUser));

          // Verify token is still valid with a backend call
          // const response = await api.get('/admin/verify');
          // if (!response.data.success) {
          //   throw new Error('Token invalid');
          // }
        }
      } catch (error) {
        console.log('Auth initialization error:', error);
        // Clear invalid auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
        
        // Only redirect to login if not already there
        if (!location.pathname.includes('/login')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up axios response interceptor for 401 errors
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear auth data on unauthorized
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          delete api.defaults.headers.common['Authorization'];
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [navigate, location]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { 
        email, 
        password,
        deviceType: "web" 
      });
console.log("response of login",response?.data)
      const { token, user} = response.data;

      if (user?.role !== 'ADMIN') {
        enqueueSnackbar('Access denied. Admins only.', { variant: 'error' });
        throw new Error('Access denied');
      }

      // Save auth data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update state and axios defaults
      setUser(user);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      enqueueSnackbar('Login successful!', { variant: 'success' });
      navigate('/');
      
      return response.data;
    } catch (error) {
      console.log('Login error:', error);
      enqueueSnackbar(error.response?.data?.message || 'Login failed', { 
        variant: 'error' 
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
    enqueueSnackbar('Logged out successfully', { variant: 'success' });
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 