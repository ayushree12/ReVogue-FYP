import api from './axios';

export const fetchSellerOrders = (params = {}) =>
  api.get('/orders/seller', { params }).then((res) => res.data);

export const updateOrderStatus = (orderId, status) =>
  api.patch(`/orders/${orderId}/status`, { status }).then((res) => res.data);

export const createOrder = (payload) =>
  api.post('/orders/checkout', payload).then((res) => res.data);
