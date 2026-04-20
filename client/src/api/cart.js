import api from './axios';

export const fetchCart = () => api.get('/cart').then((res) => res.data.cart);
export const addCartItem = (productId, qty = 1) =>
  api.post('/cart/items', { productId, qty }).then((res) => res.data.cart);
export const updateCartItem = (productId, qty) =>
  api.patch(`/cart/items/${productId}`, { qty }).then((res) => res.data.cart);
export const deleteCartItem = (productId) =>
  api.delete(`/cart/items/${productId}`).then((res) => res.data.cart);
