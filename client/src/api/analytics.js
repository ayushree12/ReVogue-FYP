import api from './axios';

export const fetchSellerAnalytics = () => api.get('/analytics/seller').then((res) => res.data);
