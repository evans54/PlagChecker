import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Bundles API
export const bundlesAPI = {
  getBundles: () => api.get('/bundles'),
  getUserSlots: () => api.get('/bundles/slots'),
  addSlots: (slots) => api.post('/bundles/slots', { slots }),
};

// Upload API
export const uploadAPI = {
  uploadFile: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getUploadStatus: (uploadId) => api.get(`/upload/${uploadId}`),
};

// Reports API
export const reportsAPI = {
  getReports: (params) => api.get('/reports', { params }),
  getReportById: (id) => api.get(`/reports/${id}`),
  downloadReport: (id) => api.get(`/reports/${id}/download`, {
    responseType: 'blob',
  }),
  deleteReport: (id) => api.delete(`/reports/${id}`),
  getStats: () => api.get('/reports/stats'),
  getRecent: () => api.get('/reports/recent'),
  regenerateReport: (id) => api.post(`/reports/${id}/regenerate`),
};

// Payments API
export const paymentsAPI = {
  initiateSTKPush: (paymentData) => api.post('/payments/mpesa-stk', paymentData),
  checkPaymentStatus: (checkoutRequestID) => api.get(`/payments/mpesa-status/${checkoutRequestID}`),
};

export default api;
