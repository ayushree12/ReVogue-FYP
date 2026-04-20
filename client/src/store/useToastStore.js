import { create } from 'zustand';

const useToastStore = create((set) => ({
  toasts: [],
  showToast: (message, tone = 'info') => {
    const id = Date.now();
    set((state) => ({ toasts: [...state.toasts, { id, message, tone }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
    }, 3000);
  }
}));

export default useToastStore;
