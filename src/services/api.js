import axios from 'axios';
import { API_URL } from '../config/env';

const api = axios.create({
  baseURL: API_URL
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {  
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Payout Methods API
export const payoutMethodsAPI = {
  // Get all payout methods with pagination and filters
  getPayoutMethods: (params = {}) => api.get('/admin/payout-methods', { params }),
  
  // Get single payout method by ID
  getPayoutMethod: (id) => api.get(`/payout-methods/${id}`),
  
  // Approve payout method
  approvePayoutMethod: (id) => api.patch(`/admin/payout-methods/${id}/approve`),
  
  // Disapprove payout method
  disapprovePayoutMethod: (id) => api.patch(`/admin/payout-methods/${id}/disapprove`),
  
  // Update payout method
  updatePayoutMethod: (id, data) => api.put(`/payout-methods/${id}`, data),
  
  // Delete payout method
  deletePayoutMethod: (id) => api.delete(`/payout-methods/${id}`),
};

// Withdraw Requests API
export const withdrawRequestsAPI = {
  // List withdraw requests
  getWithdrawRequests: (params = {}) => api.get('/admin/withdraw-requests', { params,headers:{Authorization:`Bearer ${localStorage.getItem('token')}`} }),
  // Mark a request as paid
  markPaid: (id,body) => api.patch(`/admin/withdraw/${id}/pay`,body),
};

export default api; 