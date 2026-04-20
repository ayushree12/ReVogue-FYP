import api from './axios';

export const login = (credentials) => api.post('/auth/login', credentials).then((res) => res.data);
export const register = (payload) => api.post('/auth/register', payload).then((res) => res.data);
export const fetchMe = () => api.get('/auth/me').then((res) => res.data);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email }).then((res) => res.data);
export const resetPassword = (payload) => api.post('/auth/reset-password', payload).then((res) => res.data);
