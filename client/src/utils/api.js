import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Base API URL
});

// Request interceptor to add auth token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Auto logout if 401 response returned from API
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const signup = (userData) => API.post('/auth/signup', userData);
export const login = (userData) => API.post('/auth/login', userData);

// Courses API
export const getCourses = () => API.get('/courses');
export const initiatePurchase = (courseId) => API.post('/courses/purchase', { courseId });
export const checkCourseAccess = (courseId) => API.get(`/courses/${courseId}/access`);

export default API;