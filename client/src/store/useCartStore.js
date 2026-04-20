import { create } from 'zustand';

const useCartStore = create((set) => ({
  items: [],
  setCart: (items) => set({ items }),
  clearCart: () => set({ items: [] })
}));

export default useCartStore;
