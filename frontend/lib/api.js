import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// API methods
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.get('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getFeatured: (limit = 8) => api.get(`/products/featured?limit=${limit}`),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  getById: (id) => api.get(`/products/${id}`),
};

export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getFeatured: (limit = 6) => api.get(`/projects/featured?limit=${limit}`),
  getCorporate: () => api.get('/projects/corporate'),
  getBySlug: (slug) => api.get(`/projects/slug/${slug}`),
  getById: (id) => api.get(`/projects/${id}`),
};

export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getFeatured: () => api.get('/services/featured'),
  getBySlug: (slug) => api.get(`/services/slug/${slug}`),
};

export const categoriesAPI = {
  getAll: (params) => api.get('/categories', { params }),
  getBySlug: (slug) => api.get(`/categories/slug/${slug}`),
};

export const clientsAPI = {
  getAll: (params) => api.get('/clients', { params }),
  getFeatured: () => api.get('/clients/featured'),
};

export const testimonialsAPI = {
  getAll: (params) => api.get('/testimonials', { params }),
  getFeatured: () => api.get('/testimonials/featured'),
};

export const contactAPI = {
  submit: (data) => api.post('/contacts', data),
};

export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getByNumber: (orderNumber) => api.get(`/orders/number/${orderNumber}`),
};

export default api;
