import { io } from 'socket.io-client';

let socket;

export const initSocket = (token) => {
  if (socket) {
    socket.disconnect();
  }
  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    auth: { token }
  });
  return socket;
};

export const getSocket = () => socket;
