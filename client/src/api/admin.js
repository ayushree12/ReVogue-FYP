import api from './axios';

export const fetchVerificationRequests = () =>
  api.get('/admin/verification-requests').then((res) => res.data);

export const reviewVerificationRequest = (requestId, payload) =>
  api.patch(`/admin/verification-requests/${requestId}`, payload).then((res) => res.data);
