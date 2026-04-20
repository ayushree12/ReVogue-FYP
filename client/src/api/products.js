import api from './axios';

export const fetchProducts = (params) => api.get('/products', { params }).then((res) => res.data);
export const fetchProduct = (id) => api.get(`/products/${id}`).then((res) => res.data);
export const fetchSellerProducts = (params) =>
  api.get('/products/seller/me', { params }).then((res) => res.data);
export const createProduct = (payload) =>
  api.post('/products', payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const reportProduct = (id, message) => api.post(`/products/${id}/report`, { message });
export const updateProduct = (id, payload) => api.patch(`/products/${id}`, payload);
export const deleteProductById = (id) => api.delete(`/products/${id}`);
