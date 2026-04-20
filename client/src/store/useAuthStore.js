import { create } from 'zustand';

const storedToken = localStorage.getItem('revogue_token');
const storedUser = localStorage.getItem('revogue_user');

const useAuthStore = create((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  setAuth: (user, token) => {
    localStorage.setItem('revogue_token', token);
    localStorage.setItem('revogue_user', JSON.stringify(user));
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('revogue_token');
    localStorage.removeItem('revogue_user');
    set({ user: null, token: null });
  }
}));

export default useAuthStore;
