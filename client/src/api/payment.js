import api from './axios';

export const initiateKhalti = (payload) =>
  api.post('/payments/khalti/initiate', payload).then((res) => res.data);

export const verifyKhalti = (pidx) =>
  api.post('/payments/khalti/verify', { pidx }).then((res) => res.data);
