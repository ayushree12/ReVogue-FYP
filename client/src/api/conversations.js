import api from './axios';

export const fetchSellerConversations = () =>
  api.get('/conversations/seller').then((res) => res.data);

export const startConversation = (payload) =>
  api.post('/conversations', payload).then((res) => res.data);

export const fetchBuyerConversations = () =>
  api.get('/conversations').then((res) => res.data);

export const fetchConversationMessages = (conversationId) =>
  api.get(`/conversations/${conversationId}/messages`).then((res) => res.data);
