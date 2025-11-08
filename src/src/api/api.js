// src/api/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth functions
export const register = async (userData) => {
  const res = await api.post('/auth/register', userData);
  return res.data;
};

export const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  localStorage.setItem('token', res.data.token);
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get('/profile');
  return res.data;
};

export const updateProfile = async (profileData) => {
  const res = await api.put('/profile', profileData);
  return res.data;
};

export const createProject = async (projectData) => {
  const res = await api.post('/projects', projectData);
  return res.data;
};

export const getSkills = async () => {
  const res = await api.get('/skills');
  return res.data;
};

export const getProjects = async () => {
  const res = await api.get('/projects');
  return res.data;
};

// Utility
export const isAuthenticated = () => !!localStorage.getItem('token');

export default api;